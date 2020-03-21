
export default class Main {
  private name:string;

  constructor(name:string) {
    this.name = name;
  }

  public getName():string {
    return this.name;
  }
}

const instanceMain = new Main('DenoteMD');

process.stdout.write(`Hello world, I'm ${instanceMain.getName()}\n`);
