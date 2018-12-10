import { Room, EntityMap, Client, nosync } from "colyseus";

const PLAYER_START_POSITIONS = [{ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }];

export class State {
  players: EntityMap<Player> = {};
  playerCount: number;

  @nosync
  something = "This attribute won't be sent to the client-side";

  createPlayer(id: string) {
    if (!this.playerCount) this.playerCount = 0;
    this.players[id] = new Player(PLAYER_START_POSITIONS[this.playerCount]);
    this.playerCount++;
  }

  removePlayer(id: string) {
    delete this.players[id];
    this.playerCount--;
  }

  setPosition(id: string, position: any) {
    if (this.players[id]) this.players[id].setPosition(position);
    console.log(id, this.players[id]);
  }

  setRotation(id: string, rotation: any) {
    if (this.players[id]) this.players[id].setRotation(rotation);
    console.log(id, this.players[id]);
  }
}

export class Player {
  public x: any;
  public y: any;
  public z: any;
  public rx: any;
  public ry: any;
  public rz: any;

  constructor(startPos: any) {
    this.setPosition(startPos);
  }

  setPosition(position: any) {
    if (position) {
      this.x = position.x;
      this.y = position.y;
      this.z = position.z;
    }
  }

  setRotation(rotation: any) {
    if (rotation) {
      this.rx = rotation.x;
      this.ry = rotation.y;
      this.rz = rotation.z;
    }
  }
}

export class StateHandlerRoom extends Room<State> {
  onInit(options) {
    console.log("StateHandlerRoom created!", options);

    this.setState(new State());
  }

  onJoin(client: Client) {
    this.state.createPlayer(client.sessionId);
  }

  onLeave(client: Client) {
    this.state.removePlayer(client.sessionId);
  }

  onMessage(client, data) {
    if (!data) return;

    if (data.position) this.state.setPosition(client.sessionId, data.position);
    if (data.rotation) this.state.setRotation(client.sessionId, data.rotation);
  }

  onDispose() {
    console.log("Dispose StateHandlerRoom");
  }
}
