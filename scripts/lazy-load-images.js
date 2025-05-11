/**
 * 이미지 지연 로딩 유틸리티
 * 
 * 이 스크립트는 페이지 로딩 성능을 향상시키기 위해 이미지 지연 로딩을 구현합니다.
 * React 애플리케이션에 통합하기 위한 예제 코드입니다.
 */

// 지연 로딩을 위한 React 커스텀 훅
/*
import { useRef, useEffect, useState } from 'react';

export function useLazyLoad() {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 뷰포트에 들어오면 로딩 시작
        if (entry.isIntersecting) {
          const img = imgRef.current;
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            setIsLoaded(true);
            observer.unobserve(img);
          }
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return { imgRef, isLoaded };
}
*/

// 비어있는 1x1 투명 이미지 (플레이스홀더로 사용)
export const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// LazyImage 컴포넌트 예시
/*
import React from 'react';
import { useLazyLoad, PLACEHOLDER_IMAGE } from '../scripts/lazy-load-images';

function LazyImage({ src, alt, className, ...rest }) {
  const { imgRef, isLoaded } = useLazyLoad();

  return (
    <img
      ref={imgRef}
      src={PLACEHOLDER_IMAGE}
      data-src={src}
      alt={alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      {...rest}
    />
  );
}

export default LazyImage;
*/

// 사용 방법:
/*
import LazyImage from './components/LazyImage';

function MyComponent() {
  return (
    <div>
      <LazyImage 
        src="/path/to/image.webp" 
        alt="Description" 
        className="my-image-class"
      />
    </div>
  );
}
*/

// CSS 예시:
/*
img.loading {
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
}

img.loaded {
  opacity: 1;
}
*/

// 이미지 지연 로딩 컴포넌트 사용 가이드:
console.log(`
이미지 지연 로딩 가이드:

1. src/components 폴더에 LazyImage.jsx 컴포넌트를 생성하세요.
2. 이 파일의 주석 처리된 코드를 참조하여 컴포넌트를 구현하세요.
3. 이미지가 필요한 모든 곳에서 <img> 대신 <LazyImage>를 사용하세요.
4. CSS에 적절한 로딩/로드 완료 스타일을 추가하세요.

장점:
- 초기 페이지 로딩 시간 감소
- 대역폭 사용량 최적화
- 사용자 경험 향상
`);

// 모든 이미지 파일에 대한 최적 형식 지원 확인
console.log(`
이미지 형식 최적화 체크리스트:

1. 모든 이미지를 WebP 형식으로 변환했는지 확인 (optimize-images.js 스크립트 활용)
2. 브라우저 호환성을 위해 다음과 같은 패턴을 사용하세요:

<picture>
  <source srcset="/images/example.webp" type="image/webp" />
  <source srcset="/images/example.jpg" type="image/jpeg" />
  <img src="/images/example.jpg" alt="Description" />
</picture>

또는 LazyImage 컴포넌트에서 자동으로 처리하는 방식을 구현하세요.
`); 