"use client"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 로고 섹션 */}
        <div className="flex items-center justify-center mb-6">
          <img 
            src="images/sponsors-logo.png" 
            alt="Seoul MySoul, Seoul Software Academy, 대한상공회의소, Microsoft" 
            width={600} 
            height={80}
            className="object-contain"
          />
        </div>
        
        {/* 나머지는 동일 */}
        <div className="text-center text-gray-600 text-sm leading-relaxed">
          <p className="font-medium">
            뽀식이는 서울시 SeSAC Microsoft AI Engineer 1기 과정의 최종 프로젝트로 제작되었으며,
          </p>
          <p className="font-medium">
            서울시·서울상공회의소·Microsoft의 지원으로 개발되었습니다.
          </p>
        </div>
        
        <hr className="my-6 border-gray-200" />
        
        <div className="text-center text-gray-500 text-xs">
          <p>© 2025 뽀식이. SeSAC Microsoft AI Engineer 1기.</p>
        </div>
      </div>
    </footer>
  )
}