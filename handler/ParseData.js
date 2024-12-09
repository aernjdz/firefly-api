const axios = require('axios');
const { JSDOM } = require('jsdom');
const  https = require("https");
const fs = require('fs').promises;
const path = require('path');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });


async function GetData(){
    const response = await axios.get('https://www.roe.vsei.ua/disconnections',{
        httpsAgent
    });
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    console.log(document);

    const container = document.querySelector('#fetched-data-container');

    if(!container) throw new Error('Container #fetched-data-container not found');
   
    const table = container.querySelector("table");
   
    if (!table) throw new Error('Table not found within #fetched-data-container');

    const rows = table.querySelectorAll('tr');

    const titleRow = rows[0];
    const headerRow = rows[2];
    const dateRows = Array.from(rows).slice(3);
    const title = titleRow.textContent.trim();
    const output = [];

    for (const dateRow of dateRows) {
      const date = dateRow.querySelector('td').textContent.trim();
      const dateParts = date.split('.');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const queueCells = headerRow.querySelectorAll('td');
      const timeCells = dateRow.querySelectorAll('td');
      const dayData = [];

      for (let i = 0; i < queueCells.length; i++) {
        const queueText = queueCells[i].textContent.trim();
        const queue = queueText.match(/№\s*\d+/)[0];
       
        let times = [];
        if (i < timeCells.length) {
          const timeCell = timeCells[i+1];
          if (timeCell.textContent.trim() === 'Очікується' || timeCell.textContent.trim() === "") {
            times = [];
          } else {
            const timeParagraphs = timeCell.querySelectorAll('p');
            times = Array.from(timeParagraphs).map(p => p.textContent.trim()).filter(t => t !== '');
            if (times.length === 0) {

              times = [timeCell.textContent.trim()];
            }
            
            
            
            //....
          }
        }

        dayData.push({ queue: queue[2], times });
      }

      output.push({
        date: formattedDate,
        data: dayData
      });
    }

    console.log({
        title,
        dates: output,
      });


      
      storeData({
        title,
        dates: output,
      });


    return {
      title,
      dates: output,
    };
  
}




async function storeData(result) {
    const now = new Date();
     const kyivTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }));
     const kyivDate = kyivTime.toISOString().split('T')[0];
  

     for (const dateData of result.dates) {
      
      
        
      
    const intervals = generateIntervals(dateData.data);

        const outputData = {
            date: dateData.date,
            intervals
        };

        const json_ = JSON.stringify(outputData, null, 4);
      
       const json = JSON.stringify({ title: result.title, ...dateData }, null, 4);
      
       if (dateData.date === kyivDate) {
         const latestDest = path.join(__dirname, '../outages/latest');
         await fs.mkdir(latestDest, { recursive: true });
         await fs.writeFile(path.join(latestDest, "data_v2.json"),json_);
         await fs.writeFile(path.join(latestDest, "data.json"), json);
       }
      
       const historyDest = path.join(__dirname, '../outages/history', dateData.date);
       await fs.mkdir(historyDest, { recursive: true });
       await fs.writeFile(path.join(historyDest, "data_v2.json"),json_);
       await fs.writeFile(path.join(historyDest, "data.json"), json);
     }
   }

  
   
 


    

/**
 * Генерує інтервали часу для дня з відповідним статусом.
 * @param {Array} dayData - Дані про черги і статуси.
 */
function generateIntervals(dayData) {
  const allIntervals = [];

  // Створення масиву для кожної черги
  for (const queueData of dayData) {
      const intervals = [];
      const hours = Array.from({ length: 24 }, (_, i) => i);

      // Генерація інтервалів часу для кожної черги
      for (let i = 0; i < hours.length; i++) {
          const startHour = hours[i].toString().padStart(2, '0');
          const startTime = `${startHour}:00`;
          const endTime = (startHour === '23') ? '23:59' : `${(hours[i] + 1).toString().padStart(2, '0')}:00`;

          let status = "Inactive";  // За замовчуванням статус - "Inactive"

          // Перевірка, чи є періоди відключень для цієї черги
          for (const time of queueData.times) {
              const [timeStart, timeEnd] = time.split(' - ');
              const intervalStart = new Date(`1970-01-01T${startTime}:00Z`);
              const intervalEnd = new Date(`1970-01-01T${endTime}:00Z`);
              const disconnectStart = new Date(`1970-01-01T${timeStart}:00Z`);
              const disconnectEnd = new Date(`1970-01-01T${timeEnd}:00Z`);
      
              // Перевірка, чи перетинається інтервал з періодом відключення
              if (intervalStart < disconnectEnd && intervalEnd > disconnectStart) {
                status = "Active";
                break;  // Якщо знайдено відключення для цього інтервалу, зупиняємо пошук
              }
            }

          intervals.push({ startTime, endTime, status });
      }

      // Додаємо інтервали для поточної черги до загального списку
      allIntervals.push({
          queue: queueData.queue,
          intervals
      });
  }

  return allIntervals;
}

module.exports = {
    GetData
};

