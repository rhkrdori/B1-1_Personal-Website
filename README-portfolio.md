# Personal Portfolio Website

순수 HTML, CSS, JavaScript로 만든 반응형 개인 포트폴리오 사이트입니다.

## 실행

프로젝트 루트에서 정적 서버를 실행한 후 `http://localhost:8080`을 엽니다.

```powershell
python -m http.server 8080
```

## 사용 기술

- Semantic HTML, CSS Grid/Flexbox, CSS variables
- Vanilla JavaScript (DOM, events, localStorage, Intersection Observer)
- GitHub REST API (`js/main.js`의 `CONFIG.githubUsername` 설정)

## 구현 기능

- 다크 모드와 설정 저장, 모바일 햄버거 메뉴, 부드러운 스크롤, 스크롤 탑 버튼
- Intersection Observer 기반 섹션 등장 애니메이션
- GitHub API의 로딩·성공·빈 데이터·오류 및 재시도 상태
- 프로젝트 인기순 필터, 문의 폼 필수값·이메일 검증

## 조정 기준값

- 헤더 배경 변경: 스크롤 60px
- 맨 위로 버튼 노출: 스크롤 300px
- 등장 애니메이션: Intersection Observer threshold 0.2

## 배포

GitHub Pages 배포 URL: 배포 후 이곳에 URL을 추가하세요.
