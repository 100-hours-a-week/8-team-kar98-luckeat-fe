import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// __dirname 설정 (ES 모듈에서는 __dirname이 기본적으로 제공되지 않음)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 이미지 소스 경로 및 대상 경로 설정
const sourceDir = path.join(__dirname, '../src/assets/images');
const targetDir = path.join(__dirname, '../src/assets/images/webp');

// webp 폴더가 없으면 생성
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 이미지 최적화 설정
const optimizationOptions = {
  png: { quality: 80, compressionLevel: 9 },
  jpg: { quality: 80 },
  webp: { quality: 80, lossless: false }
};

// 파일 확장자 확인 함수
function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

// 이미지 파일 확인 함수
function isImageFile(filename) {
  const ext = getFileExtension(filename);
  return ['png', 'jpg', 'jpeg', 'gif'].includes(ext);
}

// 이미지 최적화 및 변환 함수
async function optimizeImage(sourcePath, filename) {
  const ext = getFileExtension(filename);
  const baseName = path.basename(filename, `.${ext}`);
  const webpOutputPath = path.join(targetDir, `${baseName}.webp`);
  const optimizedOutputPath = path.join(targetDir, filename);

  try {
    // 원본 파일 로드
    let image = sharp(sourcePath);
    
    // 원본 형식으로 최적화
    if (ext === 'png') {
      await image.clone()
        .png(optimizationOptions.png)
        .toFile(optimizedOutputPath);
      console.log(`✅ 최적화된 PNG 파일 생성: ${optimizedOutputPath}`);
    } else if (['jpg', 'jpeg'].includes(ext)) {
      await image.clone()
        .jpeg(optimizationOptions.jpg)
        .toFile(optimizedOutputPath);
      console.log(`✅ 최적화된 JPG 파일 생성: ${optimizedOutputPath}`);
    }

    // WebP 형식으로 변환
    await image
      .webp(optimizationOptions.webp)
      .toFile(webpOutputPath);
    console.log(`✅ WebP 파일 생성: ${webpOutputPath}`);

    // 이미지 메타데이터 출력
    const metadata = await image.metadata();
    console.log(`📊 ${filename} - 원본 크기: ${metadata.width}x${metadata.height}`);
  } catch (error) {
    console.error(`❌ 이미지 최적화 실패 (${filename}):`, error);
  }
}

// 메인 함수
async function optimizeAllImages() {
  try {
    const files = fs.readdirSync(sourceDir);
    
    console.log(`🔍 소스 디렉토리에서 ${files.length}개의 파일을 찾았습니다.`);
    
    // 진행 중인 최적화 작업들의 Promise 배열
    const optimizationPromises = [];
    
    for (const file of files) {
      // 디렉토리는 건너뛰기
      const sourcePath = path.join(sourceDir, file);
      if (fs.statSync(sourcePath).isDirectory()) continue;
      
      // 이미지 파일만 처리
      if (isImageFile(file)) {
        console.log(`🔄 처리 중: ${file}`);
        optimizationPromises.push(optimizeImage(sourcePath, file));
      }
    }
    
    // 모든 최적화 작업이 완료될 때까지 기다림
    await Promise.all(optimizationPromises);
    
    console.log('✨ 모든 이미지 최적화 완료!');
  } catch (error) {
    console.error('❌ 이미지 최적화 중 오류 발생:', error);
  }
}

// 스크립트 실행
optimizeAllImages(); 