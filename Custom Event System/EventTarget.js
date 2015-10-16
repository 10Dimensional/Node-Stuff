let map= new WeakMap();

class EventTarget {
    constructor() {
        map.set(this, {
            listeners: {}
        });
    }
    
    addListener(type, fn) {
        let listeners = map.get(this).listeners;
        
        if(!listeners[type]) {
            listeners[type] = [];
        }
        
        listeners[type].push(fn);
    }
    
    fireEvent() {
        if (!type) {
            throw new Error("we need to know the type.");
        }
        
        if (eventObj.type) {
            eventObj.type = type;
        }
        
        if(!eventObj.target) {
            
        }
        
    }
    
    removeListener(tpe, fn) {
        let listeners = map = map.get(this).listeners[type];
        
        if(!listeners) {
            return;
        }
        
        let index = listeners.indexOf(fn);
        
        while(index > -1) {
            listeners.splice(index, i);
            
            index = listeners.indexOf(fn);
        }
    }
}