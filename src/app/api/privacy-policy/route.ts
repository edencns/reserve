import { NextResponse } from 'next/server'

export async function GET() {
  const policy = {
    lastUpdated: '2024-01-01',
    company: '입주박람회 운영사',
    items: [
      {
        title: '수집하는 개인정보',
        content: '성명, 휴대전화번호, 이메일 주소, 주소(선택)'
      },
      {
        title: '개인정보 수집 목적',
        content: '박람회 방문 예약 서비스 제공, 예약 확인 안내'
      },
      {
        title: '개인정보 보유 기간',
        content: '행사 종료 후 30일 이내 파기'
      },
      {
        title: '개인정보 제3자 제공',
        content: '원칙적으로 제3자에게 제공하지 않으나, 법령에 의한 경우 예외'
      },
      {
        title: '정보주체의 권리',
        content: '개인정보 열람, 정정, 삭제, 처리정지 요구 가능'
      }
    ]
  }

  return NextResponse.json(policy)
}
