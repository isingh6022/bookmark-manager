import * as path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = path.resolve('persistent-storage', 'data.json');
const FILE_PATH_BKM = path.resolve('persistent-storage', 'bkmData.json');
const [getData, saveData, clearData] = (() => {
  let data: { [key: string]: any } = {};
  try {
    data = JSON.parse(readFileSync(FILE_PATH, { encoding: 'utf-8' }));
  } catch (err) {
    console.error(err);
    data = {};
  }

  let persistCBRef: any;
  const persistData = () => {
    persistCBRef && clearTimeout(persistCBRef);
    persistCBRef = setTimeout(() => {
      writeFileSync(FILE_PATH, JSON.stringify(data), { encoding: 'utf-8' });
      console.log('Saved current state in the JSON file...');
    }, 200);
  };

  return [
    () => {
      return data;
    },
    (newData: any): boolean => {
      if (typeof newData === 'object') {
        data = { ...data, ...newData };
        persistData();
        return true;
      }
      console.log('Bad update request data: ', newData);
      return false;
    },
    () => {
      data = {};
      persistData();
      console.log('--- cleared all data ---');

      return true;
    }
  ];
})();

app.post('/fetch', (req: Request, res: Response) => {
  res.json(getData());
});
app.get('/fetch', (req: Request, res: Response) => {
  res.write(JSON.stringify(getData()));
  res.end();
});

app.post('/save', (req: Request, res: Response) =>
  saveData(req.body) ? res.sendStatus(200) : res.sendStatus(400)
);

let currData = JSON.parse(readFileSync(FILE_PATH_BKM, { encoding: 'utf-8' }));
let timeoutRef: any;
app.post('/load_bookmarks', (req: Request, res: Response) => {
  res.json(currData);
});
app.post('/save_bookmarks', (req: Request, res: Response) => {
  if (req.body) {
    currData = req.body;
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    timeoutRef = setTimeout(() => {
      writeFileSync(FILE_PATH_BKM, JSON.stringify(req.body), { encoding: 'utf-8' });
      console.log('Updated bookmarks data...');
    }, 200);
    res.sendStatus(200);
  } else {
    console.log('No request body in request to save bookmarks...');
    res.sendStatus(400);
  }
});

app.post('/clear', (req: Request, res: Response) => clearData());

app.listen(8081, () => {
  console.log(`Data file path: ${FILE_PATH}`);
  console.log('Server listening on port 8081...');
});
