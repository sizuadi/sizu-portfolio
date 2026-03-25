---
title: "Building Scalable Real-Time Systems with WebSockets"
date: "2025-11-08"
readTime: "8 min"
tags: ["WebSocket", "Architecture", "Node.js", "Redis"]
excerpt: "A deep dive into designing WebSocket infrastructure that handles 100K+ concurrent connections with graceful fallback strategies and horizontal scaling patterns."
---

Real-time features have become table stakes for modern applications. Whether it's live notifications, collaborative editing, or streaming dashboards, users expect instant feedback. But building WebSocket infrastructure that actually scales is harder than most tutorials suggest.

## The Challenge

When we started building the real-time layer at Meridian, our initial prototype worked beautifully — for 50 users. Things got interesting when we hit 10,000 concurrent connections. The single Node.js process was maxing out, messages were getting dropped, and reconnection storms after deploys were taking down our servers.

## Architecture Decisions

### Connection Management

We settled on a **multi-layer approach**:

1. **Load balancer** with sticky sessions — we use IP hash to route users to consistent backend instances
2. **Connection pool manager** — each Node.js process handles up to 10K connections
3. **Redis Pub/Sub** for cross-instance message broadcasting

```typescript
// Simplified connection manager
class ConnectionPool {
  private connections = new Map<string, WebSocket>();
  private redis: Redis;

  async broadcast(channel: string, payload: unknown) {
    // Publish to Redis — all instances receive it
    await this.redis.publish(channel, JSON.stringify(payload));
  }

  onRedisMessage(channel: string, message: string) {
    // Forward to all local connections subscribed to this channel
    const subscribers = this.getSubscribers(channel);
    for (const ws of subscribers) {
      ws.send(message);
    }
  }
}
```

### Graceful Degradation

Not every feature needs true real-time. We built a **fallback hierarchy**:

- **WebSocket** → primary, sub-100ms latency
- **Server-Sent Events** → fallback for environments blocking WS
- **Long polling** → last resort, 2-second intervals

The client automatically negotiates the best available transport.

## Scaling to 100K+

The key insight was separating **connection state** from **application state**. WebSocket servers became stateless — they only manage connections and forward messages. All business logic lives in separate services that communicate via Redis streams.

This let us horizontally scale the WebSocket layer independently. Need more capacity? Add more instances. No data migration, no rebalancing.

## Lessons Learned

1. **Heartbeats matter** — implement both client-side and server-side ping/pong. Zombie connections are silent killers.
2. **Exponential backoff with jitter** — without jitter, reconnection storms after a deploy will DDoS your own servers.
3. **Message ordering is hard** — if you need guaranteed ordering, use sequence numbers and client-side buffering. Don't assume the network preserves order.
4. **Monitor connection counts, not just traffic** — a server handling 50K idle connections behaves very differently from one handling 5K active ones.

Real-time systems are deceptively simple at small scale. The complexity lives in the failure modes — and those only show up in production.
