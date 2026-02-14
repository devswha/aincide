import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { config } from 'dotenv';

// Load .env from project root
config({ path: resolve(__dirname, '..', '..', '.env') });

const HITORI_TOKEN = process.env.HITORI_TOKEN;
const TEAM_CHANNEL = '1471757111892381900';
const MAGI_ROLE_ID = '1467806656699170902';
const DISCORD_API = 'https://discord.com/api/v10';

test.describe('봇 자율 개발 파이프라인', () => {
  test('!task 명령으로 태스크 생성 확인', async ({ request }) => {
    test.skip(!HITORI_TOKEN, 'HITORI_TOKEN이 .env에 설정되어 있지 않습니다');
    // 1. Hitori가 !task 명령을 전송
    const taskTitle = `E2E 테스트 태스크 ${Date.now()}`;
    const sendRes = await request.post(`${DISCORD_API}/channels/${TEAM_CHANNEL}/messages`, {
      headers: { Authorization: `Bot ${HITORI_TOKEN}` },
      data: { content: `<@&${MAGI_ROLE_ID}> !task ${taskTitle}` },
    });
    expect(sendRes.ok(), `메시지 전송 실패: ${sendRes.status()}`).toBeTruthy();
    const sentMsg = await sendRes.json();
    console.log(`[Hitori] 메시지 전송: ${sentMsg.id}`);

    // 2. MAGI 응답 대기 (최대 30초, 2초 간격 폴링)
    let magiReply: string | null = null;
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));

      const historyRes = await request.get(
        `${DISCORD_API}/channels/${TEAM_CHANNEL}/messages?after=${sentMsg.id}&limit=10`,
        { headers: { Authorization: `Bot ${HITORI_TOKEN}` } },
      );
      if (!historyRes.ok()) continue;

      const messages = await historyRes.json();
      const reply = messages.find(
        (m: { author: { bot: boolean }; content: string; message_reference?: { message_id: string } }) =>
          m.author.bot && m.message_reference?.message_id === sentMsg.id,
      );

      if (reply) {
        magiReply = reply.content;
        console.log(`[MAGI] 응답: ${magiReply?.slice(0, 100)}`);
        break;
      }
    }

    expect(magiReply, 'MAGI가 30초 내에 응답하지 않음').not.toBeNull();
    expect(magiReply).toContain('태스크');
  });

  test('!tasks 명령으로 태스크 목록 확인', async ({ request }) => {
    test.skip(!HITORI_TOKEN, 'HITORI_TOKEN이 .env에 설정되어 있지 않습니다');
    const sendRes = await request.post(`${DISCORD_API}/channels/${TEAM_CHANNEL}/messages`, {
      headers: { Authorization: `Bot ${HITORI_TOKEN}` },
      data: { content: `<@&${MAGI_ROLE_ID}> !tasks` },
    });
    expect(sendRes.ok()).toBeTruthy();
    const sentMsg = await sendRes.json();

    // MAGI 응답 대기
    let magiReply: string | null = null;
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));

      const historyRes = await request.get(
        `${DISCORD_API}/channels/${TEAM_CHANNEL}/messages?after=${sentMsg.id}&limit=10`,
        { headers: { Authorization: `Bot ${HITORI_TOKEN}` } },
      );
      if (!historyRes.ok()) continue;

      const messages = await historyRes.json();
      const reply = messages.find(
        (m: { author: { bot: boolean }; content: string; message_reference?: { message_id: string } }) =>
          m.author.bot && m.message_reference?.message_id === sentMsg.id,
      );

      if (reply) {
        magiReply = reply.content;
        console.log(`[MAGI] 태스크 목록: ${magiReply?.slice(0, 200)}`);
        break;
      }
    }

    expect(magiReply, 'MAGI가 30초 내에 응답하지 않음').not.toBeNull();
  });

  test('일반 채팅 AI 응답 확인', async ({ request }) => {
    test.skip(!HITORI_TOKEN, 'HITORI_TOKEN이 .env에 설정되어 있지 않습니다');
    const sendRes = await request.post(`${DISCORD_API}/channels/${TEAM_CHANNEL}/messages`, {
      headers: { Authorization: `Bot ${HITORI_TOKEN}` },
      data: { content: `<@&${MAGI_ROLE_ID}> 안녕, MAGI. 현재 프로젝트 상태 알려줘.` },
    });
    expect(sendRes.ok()).toBeTruthy();
    const sentMsg = await sendRes.json();

    // AI 응답은 더 오래 걸릴 수 있음 (최대 60초)
    let magiReply: string | null = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));

      const historyRes = await request.get(
        `${DISCORD_API}/channels/${TEAM_CHANNEL}/messages?after=${sentMsg.id}&limit=10`,
        { headers: { Authorization: `Bot ${HITORI_TOKEN}` } },
      );
      if (!historyRes.ok()) continue;

      const messages = await historyRes.json();
      const reply = messages.find(
        (m: { author: { bot: boolean }; content: string; message_reference?: { message_id: string } }) =>
          m.author.bot && m.message_reference?.message_id === sentMsg.id,
      );

      if (reply) {
        magiReply = reply.content;
        console.log(`[MAGI] AI 응답: ${magiReply?.slice(0, 200)}`);
        break;
      }
    }

    expect(magiReply, 'MAGI가 60초 내에 AI 응답하지 않음').not.toBeNull();
    expect(magiReply!.length).toBeGreaterThan(10);
  });
});
