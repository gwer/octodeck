import { Octostore } from '../octostore';

enum Fields {
  DECK = 0,
  SLIDE = 1,
}

export class Deckstore {
  static async getDeck(): Promise<string | null> {
    return await Octostore.getItem(Fields.DECK);
  }

  static async setDeck(deck: string): Promise<void> {
    return await Octostore.setItem(Fields.DECK, deck);
  }

  static async getSlide(): Promise<string | null> {
    return await Octostore.getItem(Fields.SLIDE);
  }

  static async setSlide(slide: string): Promise<void> {
    return await Octostore.setItem(Fields.SLIDE, slide);
  }
}
