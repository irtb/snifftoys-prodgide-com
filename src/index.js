export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let key = url.pathname.slice(1); // 移除路径开头的斜杠

    // 如果路径为空或以斜杠结尾，追加 index.html
    if (key === '' || key.endsWith('/')) {
      key += 'index.html';
    }

    // 从 R2 获取文件
    const object = await env.MY_BUCKET.get(key);
    if (!object) {
      return new Response('文件未找到', { status: 404 });
    }

    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
  }
};