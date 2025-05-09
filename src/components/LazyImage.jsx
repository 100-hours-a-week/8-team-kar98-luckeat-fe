import { useRef, useEffect, useState } from 'react';
import defaultImage from '../assets/images/luckeat_default_image.webp';

// 비어있는 1x1 투명 이미지 (플레이스홀더로 사용)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

/**
 * 이미지 지연 로딩 컴포넌트
 * 
 * @param {string} src - 이미지 경로 (원본 형식)
 * @param {string} webpSrc - WebP 형식 이미지 경로 (미제공 시 원본에서 확장자만 변경하여 사용)
 * @param {string} alt - 이미지 대체 텍스트
 * @param {string} className - 추가 CSS 클래스
 * @param {object} props - 기타 img 태그에 전달할 속성들
 */
function LazyImage({ src, webpSrc, alt, className = '', width, height, ...props }) {
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(PLACEHOLDER_IMAGE);
  const [hasErrored, setHasErrored] = useState(false);

  // 로컬 애셋 이미지 경로 처리
  const processImagePath = (imagePath) => {
    if (!imagePath) return imagePath;
    
    // /src/assets/로 시작하는 경로를 로컬 import 방식으로 변경
    if (imagePath.startsWith('/src/assets/')) {
      return imagePath.replace('/src/assets/', '/assets/');
    }
    
    // 클라우드프론트 URL이 한글이나 특수문자를 포함하는 경우 인코딩 문제 해결
    if (imagePath.includes('cloudfront.net')) {
      try {
        // URL 구성요소 분리
        const urlParts = imagePath.split('/');
        // 마지막 부분(파일명)만 인코딩
        const fileName = urlParts[urlParts.length - 1];
        
        // 이미 인코딩된 URL이면 그대로 사용
        if (/%[0-9A-F]{2}/.test(fileName)) {
          return imagePath;
        }
        
        // 한글이나 특수문자가 있으면 인코딩
        if (/[^\x00-\x7F]/.test(fileName) || /[\s+%]/.test(fileName)) {
          const encodedFileName = encodeURIComponent(fileName);
          urlParts[urlParts.length - 1] = encodedFileName;
          return urlParts.join('/');
        }
      } catch (error) {
        console.error('URL 처리 중 오류:', error);
      }
    }
    
    return imagePath;
  };

  // 원본 이미지 경로에서 WebP 경로 생성
  const getWebpPath = (originalPath) => {
    if (webpSrc) return webpSrc;
    if (!originalPath) return null;
    
    try {
      // CloudFront URL인 경우 확장자만 변경
      if (originalPath.includes('cloudfront.net')) {
        // 확장자 변경 (png, jpg, jpeg -> webp)
        const lastDotIndex = originalPath.lastIndexOf('.');
        if (lastDotIndex !== -1) {
          const extension = originalPath.substring(lastDotIndex + 1).toLowerCase();
          if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
            return originalPath.substring(0, lastDotIndex) + '.webp';
          }
        }
      }
      
      // 일반 경로의 경우 기존 로직 유지
      const lastDotIndex = originalPath.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        return originalPath.substring(0, lastDotIndex) + '.webp';
      }
      return originalPath + '.webp';
    } catch (error) {
      console.error('WebP 경로 생성 중 오류:', error);
      return originalPath;
    }
  };

  useEffect(() => {
    // 오류 상태 초기화
    if (src !== imgSrc) {
      setHasErrored(false);
    }
    
    // 최초 src가 없거나 null이면 옵저버 생성 안함
    if (!src) return;

    // 처리된 이미지 경로
    const processedSrc = processImagePath(src);

    // IntersectionObserver 인스턴스 생성
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // 뷰포트에 들어오면 이미지 로딩
        if (entry.isIntersecting) {
          setImgSrc(processedSrc);
          setIsLoaded(true);
          
          // imgRef.current가 있을 때만 unobserve 호출
          if (imgRef.current && observerRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      },
      {
        rootMargin: '50px', // 뷰포트로부터 50px 전에 로딩 시작
        threshold: 0.1 // 이미지의 10%가 보이면 로딩 시작
      }
    );

    // imgRef.current가 있을 때만 observe 호출
    if (imgRef.current && observerRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    // 컴포넌트 언마운트 시 IntersectionObserver 정리
    return () => {
      if (observerRef.current) {
        if (imgRef.current) {
          try {
            observerRef.current.unobserve(imgRef.current);
          } catch (error) {
            console.error('IntersectionObserver unobserve 오류:', error);
          }
        }
        observerRef.current.disconnect();
      }
    };
  }, [src, imgSrc]);

  // 이미지 로드 오류 처리
  const handleError = () => {
    console.warn(`이미지 로드 실패: ${src}`);
    
    // 이미 오류가 발생한 경우 무한 루프 방지
    if (hasErrored) {
      setImgSrc(defaultImage);
      return;
    }
    
    setHasErrored(true);
    
    try {
      // 로컬 경로인지 확인
      if (src && src.startsWith('/src/assets/')) {
        console.log('로컬 경로 감지됨, 변환 필요:', src);
        // 로컬 경로 재시도
        setImgSrc(processImagePath(src));
      }
      // 클라우드프론트 URL인지 확인
      else if (src && src.includes('cloudfront.net')) {
        console.log('클라우드프론트 URL 감지됨:', src);
        const fileExtension = src.split('.').pop().toLowerCase();
        console.log('파일 확장자:', fileExtension);
        
        // 클라우드프론트 URL에 한글이나 특수문자가 있는 경우 인코딩 처리 재시도
        const encodedSrc = processImagePath(src);
        if (encodedSrc !== src) {
          console.log('URL 인코딩 처리 후 재시도:', encodedSrc);
          setImgSrc(encodedSrc);
          return;
        }
      }
    } catch (error) {
      console.error('URL 파싱 중 오류:', error);
    }
    
    // 모든 재시도 실패 시 기본 이미지로 대체
    setImgSrc(defaultImage);
  };

  return (
    <picture>
      {/* WebP 지원 브라우저용 */}
      <source 
        srcSet={isLoaded && !hasErrored ? getWebpPath(src) : PLACEHOLDER_IMAGE} 
        type="image/webp" 
      />
      
      {/* 원본 이미지 (WebP 미지원 브라우저용) */}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt || ''}
        className={`lazy-image ${isLoaded ? 'loaded' : 'loading'} ${className}`}
        width={width}
        height={height}
        loading="lazy" // 네이티브 지연 로딩도 활성화
        onError={handleError}
        {...props}
      />
    </picture>
  );
}

export default LazyImage; 