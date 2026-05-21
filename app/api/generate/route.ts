import OpenAI from 'openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: '未配置 API Key' }, { status: 500 })
    }

    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    })

    const { topic, contentType, audience, style, useEmoji, count } = await req.json()

    const systemPrompt = `你是一个小红书爆款标题专家。根据用户提供的信息，生成${count}个吸引人的小红书标题。

要求：
- 每个标题 20 字以内
- ${useEmoji ? '适当使用 emoji 增加吸引力' : '不使用任何 emoji'}
- 风格：${style}
- 目标人群：${audience}
- 避免标题党，真实可信

标题公式参考：
1. 数字 + 痛点 + 解决方案（"3个拯救熬夜脸的方法"）
2. 身份标签 + 效果承诺（"打工人必学的效率翻倍技巧"）
3. 反常识观点（"为什么我劝你别买平替"）
4. 场景 + 情绪 + 结果（"周末宅家做了这件事，太治愈了"）
5. 对比式（"从xx到xx，我只做了一件事"）

直接输出标题，每行一个，不要编号。`

    const userPrompt = `内容主题：${topic}
内容类型：${contentType}`

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 1024,
    })

    const raw = completion.choices[0]?.message?.content || ''
    const titles = raw
      .split('\n')
      .map((t) => t.replace(/^\d+[\.\、\s]+/, '').trim())
      .filter(Boolean)

    return NextResponse.json({ titles })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: '生成失败，请稍后重试' }, { status: 500 })
  }
}
