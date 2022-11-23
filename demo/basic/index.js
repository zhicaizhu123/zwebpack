import './demo.css';
import './demo.less';
import './demo.scss';
import './music.mp3';

const hello = 1;

console.log('hello webpack', hello);

function getData() {
  const map = new Map();
  map.set('add', 1);
  return Promise.resolve({ data: '124' });
}

getData().then(res => {
  console.log(res);
});

class Animal {
  async getName(...args) {
    console.log(args);
    const map = new Map();
    map.set(123, 456);
    return '124';
  }
}

const animal = new Animal();

animal.getName(1, 2, 3);