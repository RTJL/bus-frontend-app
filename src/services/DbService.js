import { openDB } from 'idb';

const BUSSTOPS_DB_NAME = 'BUSSTOPS'
const BUSSTOPS_DB_VERSION = 1;

const BUSES_DB_NAME = 'BUSES'
const BUSES_DB_VERSION = 1;

const busstopDb = openDB(BUSSTOPS_DB_NAME, BUSSTOPS_DB_VERSION, {
  upgrade(upgradeDb) {
    switch(upgradeDb.version) {
      case 0:
      case 1:
      default:
        const tx = upgradeDb.createObjectStore('busStopCodeIndex', { keyPath: 'BusStopCode'});
        tx.createIndex('by-lat', 'Latitude');
        tx.createIndex('by-long', 'Longitude');
    }
  }
});

const busesDb = openDB(BUSES_DB_NAME, BUSES_DB_VERSION, {
  upgrade(upgradeDb) {
    switch(upgradeDb.version) {
      case 0:
      case 1:
      default:
        upgradeDb.createObjectStore('serviceNoIndex', { keyPath: "ServiceNo" });
    }
  }
});

class DbService {
  getBusStopCount() {
    return busstopDb.then(db => {
      const tx = db.transaction('busStopCodeIndex', 'readonly');
      return tx.objectStore('busStopCodeIndex').count();
    });
  }

  putAllBusStop(busStops) {
    return busstopDb.then(db => {
      const tx = db.transaction('busStopCodeIndex', 'readwrite');
      const transactions = busStops.map(busStop => {
        return tx.store.put(busStop);
      });
      transactions.push(tx.done);
      return Promise.all(transactions);
    }).catch(e => {
      console.log(e);
    });
  }

  getAllBusStop() {
    return busstopDb.then(db => {
      return db.getAll('busStopCodeIndex');
    });
  }

  getBusStop(busStopCode) {
    return busstopDb.then(db => {
      return db.get('busStopCodeIndex', busStopCode);
    })
  }

  getBusStopLatBound(minLat, maxLat) {
    const latRange = IDBKeyRange.bound(minLat, maxLat);
    return busstopDb.then(db => {
      return db.getAllFromIndex('busStopCodeIndex', 'by-lat', latRange);
    });
  }

  getBusStopLngBound(minLng, maxLng) {
    const LngRange = IDBKeyRange.bound(minLng, maxLng);
    return busstopDb.then(db => {
      return db.getAllFromIndex('busStopCodeIndex', 'by-long', LngRange);      
    });
  }

  putAllBuses(buses) {
    return busesDb.then(db => {
      const tx = db.transaction('serviceNoIndex', 'readwrite');
      const transactions = buses.map(bus => {
        return tx.store.put(bus);
      })
      transactions.push(tx.done);
      return Promise.all(transactions);
    }).catch(e => {
      console.log(e);
    })
  }

  getAllBuses() {
    return busesDb.then(db => {
      return db.getAll('serviceNoIndex');
    });
  }

  getBus(serviceNo) {
    return busesDb.then(db => {
      return db.get('serviceNoIndex', serviceNo);
    })
  }


}

export const Service = new DbService();
