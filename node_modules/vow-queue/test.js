var Queue = require('./lib/queue'),
    vow = require('vow'),

    queue = new Queue({ weightLimit : 2 }),
    d1 = vow.defer(),
    d2 = vow.defer(),
    d3 = vow.defer(),
    callCount = 0,
    p1task = queue.enqueue(function() {
        callCount++;
        return d1.promise();
    });

queue.enqueue(function() {
    callCount++;
    return d2.promise();
});

queue.enqueue(function() {
    callCount++;
    return d3.promise();
});

queue.enqueue(function() {
    callCount++;
    return d3.promise();
});

d1.resolve();
p1task.then(function() {
    console.log(callCount);
});

queue.start();
