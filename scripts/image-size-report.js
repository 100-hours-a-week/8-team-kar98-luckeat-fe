import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 설정 (ES 모듈에서는 __dirname이 기본적으로 제공되지 않음)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 디렉토리 경로 설정
const sourceDir = path.join(__dirname, '../src/assets/images');
const webpDir = path.join(__dirname, '../src/assets/images/webp');

// 바이트를 사람이 읽기 쉬운 형식으로 변환
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 이미지 파일 확장자 확인
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
}

// 보고서 생성 함수
async function generateReport() {
  const report = {
    originalFiles: [],
    webpFiles: [],
    comparisons: [],
    totalOriginalSize: 0,
    totalWebpSize: 0
  };
  
  try {
    // 원본 디렉토리의 모든 파일을 가져옴
    const originalFiles = fs.readdirSync(sourceDir)
      .filter(file => isImageFile(file) && !fs.statSync(path.join(sourceDir, file)).isDirectory());
    
    // 웹프 디렉토리의 모든 파일을 가져옴
    const webpFiles = fs.existsSync(webpDir)
      ? fs.readdirSync(webpDir).filter(file => path.extname(file).toLowerCase() === '.webp')
      : [];
    
    // 원본 파일 정보 수집
    for (const file of originalFiles) {
      const filePath = path.join(sourceDir, file);
      const fileStats = fs.statSync(filePath);
      
      report.originalFiles.push({
        name: file,
        size: fileStats.size,
        sizeFormatted: formatBytes(fileStats.size)
      });
      
      report.totalOriginalSize += fileStats.size;
    }
    
    // WebP 파일 정보 수집
    for (const file of webpFiles) {
      const filePath = path.join(webpDir, file);
      const fileStats = fs.statSync(filePath);
      
      report.webpFiles.push({
        name: file,
        size: fileStats.size,
        sizeFormatted: formatBytes(fileStats.size)
      });
      
      report.totalWebpSize += fileStats.size;
    }
    
    // 비교 데이터 생성
    for (const originalFile of report.originalFiles) {
      // 확장자 없는 파일 이름 추출
      const baseName = path.basename(originalFile.name, path.extname(originalFile.name));
      const webpFileName = baseName + '.webp';
      
      // 해당 WebP 파일 찾기
      const webpFile = report.webpFiles.find(f => f.name === webpFileName);
      
      if (webpFile) {
        const sizeDiff = originalFile.size - webpFile.size;
        const savingsPercent = (sizeDiff / originalFile.size) * 100;
        
        report.comparisons.push({
          originalFile: originalFile.name,
          webpFile: webpFile.name,
          originalSize: formatBytes(originalFile.size),
          webpSize: formatBytes(webpFile.size),
          savedBytes: formatBytes(sizeDiff),
          savingsPercent: savingsPercent.toFixed(2) + '%'
        });
      }
    }
    
    // 총 절약된 용량 계산
    const totalSavings = report.totalOriginalSize - report.totalWebpSize;
    const totalSavingsPercent = (totalSavings / report.totalOriginalSize) * 100;
    
    // 결과 출력
    console.log('\n===== 이미지 최적화 보고서 =====\n');
    
    console.log('원본 이미지 파일:', report.originalFiles.length, '개');
    console.log('WebP 이미지 파일:', report.webpFiles.length, '개');
    console.log('총 원본 이미지 크기:', formatBytes(report.totalOriginalSize));
    console.log('총 WebP 이미지 크기:', formatBytes(report.totalWebpSize));
    console.log('총 절약된 용량:', formatBytes(totalSavings), `(${totalSavingsPercent.toFixed(2)}% 절약)`);
    
    console.log('\n===== 파일별 비교 =====\n');
    
    // 절약률 순으로 정렬하여 표시
    report.comparisons.sort((a, b) => {
      return parseFloat(b.savingsPercent) - parseFloat(a.savingsPercent);
    });
    
    for (const comparison of report.comparisons) {
      console.log(`${comparison.originalFile} → ${comparison.webpFile}`);
      console.log(`  원본: ${comparison.originalSize}, WebP: ${comparison.webpSize}`);
      console.log(`  절약: ${comparison.savedBytes} (${comparison.savingsPercent})`);
      console.log('');
    }
    
    console.log('\n===== 최적화되지 않은 파일 =====\n');
    
    const optimizedFileNames = report.comparisons.map(c => c.originalFile);
    const unoptimizedFiles = report.originalFiles.filter(f => !optimizedFileNames.includes(f.name));
    
    if (unoptimizedFiles.length > 0) {
      for (const file of unoptimizedFiles) {
        console.log(`${file.name} (${file.sizeFormatted})`);
      }
    } else {
      console.log('모든 이미지가 최적화되었습니다! 👍');
    }
    
  } catch (error) {
    console.error('보고서 생성 중 오류 발생:', error);
  }
}

// 스크립트 실행
generateReport(); 