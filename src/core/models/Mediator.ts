import type { Client } from './Client'

export interface Mediator {
  notify(senderIndex: number, client: Client): void
}
