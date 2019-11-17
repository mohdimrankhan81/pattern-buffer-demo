//import employees from './Employees.json';

let employeeBuffer;
const bufferSize = 5, startIndex = 0;

function fetchEmployees(batchNumber, batchSize) {
    if(batchNumber === 0){
        initializeBuffer();
    }
    let reqdEmployees = [];
    while (reqdEmployees.length < batchSize) {
        const generatorResult = employeeBuffer.next();
        if(generatorResult.done){
            const isReloaded = reLoadBufferWithEmployees(generatorResult);
            if(!isReloaded){
                break;
            }
            continue;
        }
        reqdEmployees.push(generatorResult.value);
    }
    return reqdEmployees;
}

function reLoadBufferWithEmployees(generatorResult) {
    const {mergedBuffer} = generatorResult.value;
    const nextBatch = getEmployees(mergedBuffer.length, bufferSize);
    employeeBuffer = employeeGenerator(mergedBuffer, nextBatch);
    return nextBatch.length > 0;
}

function  * employeeGenerator(lastBatch = [], nextBatch) {
    console.log('Last Batch:', lastBatch);
    console.log('Next Batch:', nextBatch);
    let nextEmployeeIndex = lastBatch.length;
    const mergedBuffer = lastBatch.concat(nextBatch);

    while(nextEmployeeIndex < mergedBuffer.length) {
        yield mergedBuffer[nextEmployeeIndex++];
    }
    return {
        mergedBuffer
    };
}

function initializeBuffer() {
    const employees = getEmployees(startIndex, bufferSize);
    employeeBuffer = employeeGenerator([], employees);
}

/**
 * This is a simulation of BE API.
 * It will load the data from JSON but this should be replaced by a ReST call.
 * @param startIndex
 * @param batchSize
 */
function getEmployees(startIndex, batchSize){
    const employees = require('./Employees');
    return employees.slice(startIndex, startIndex + batchSize);
}

function  main() {
    const firstBatch = fetchEmployees(0, 3);
    console.log('First Batch: ', firstBatch);
    const secondBatch = fetchEmployees(1, 4);
    console.log('Second Batch: ', secondBatch);
}

main();