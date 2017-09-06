var crypto = require('crypto');
var https = require('https');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var travis = {


    // Travis CI set environment variables
    // http://docs.travis-ci.com/user/ci-environment/#Environment-variables

    CURRENT_JOB_ID: parseInt(process.env.TRAVIS_JOB_ID, 10),
    CURRENT_JOB_TEST_RESULT: parseInt(process.env.TRAVIS_TEST_RESULT, 10),


    // Travis CI API URLs
    // http://docs.travis-ci.com/api/

    API_BUILD_URL: 'https://api.travis-ci.org/builds/' + parseInt(process.env.TRAVIS_BUILD_ID, 10),
    API_JOBS_URL: 'https://api.travis-ci.org/jobs/'


};

var configs = {

    callback: undefined,

    CHECK_INTERVAL_LIMIT: 15000,
    checkInterval: 3000,

    keys: {
        'FAILURE': 'travis-after-all: failed',
        'SUCCESS': 'travis-after-all: succeeded'
    },

    LOG_PREFIX: '[travis-after-all]',

};

// ---------------------------------------------------------------------

function allJobsAreDone(jobs) {
    return jobs.every(function (job) {
        return job.result !== null;
    });
}

function allJobsPassed(jobs) {
    return jobs.every(function (job) {

        // A job passed if it either succeeded or it failed but
        // it was allowed to fail (has `allow_failure` set to true).
        //
        // http://docs.travis-ci.com/user/customizing-the-build/#Rows-that-are-Allowed-to-Fail

        return job.result === 0 || ( job.result === 1 && job.allow_failure === true );

    });
}

function endJob(code, error) {

    if ( error !== undefined ) {
        log(error.message);
    }

    if ( code === 2 ) {
        log('Some other job was assigned to do the task');
    }

    if ( typeof configs.callback === 'function' ) {
        configs.callback(code, error);
    } else {
        process.exit(code);
    }

}

function generateToken(text, key) {
    return crypto.createHmac('sha256', key).update('' + text).digest('hex');
}

function getBuildData() {
     getJSON(travis.API_BUILD_URL, function (data) {

         var jobs = data.matrix;

         // For the current job the result is already
         // known, so there is no need to figure that out.

         jobs.some(function (job) {
             if ( job.id === travis.CURRENT_JOB_ID ) {
                 job.result = travis.CURRENT_JOB_TEST_RESULT;
                 return true;
             }
             return false;
         });

         handleJob(jobs);

     });
}

function getJSON(url, callback) {

    https.get(url, function(response) {

        var body = '';

        response.setEncoding('utf8');

        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {

            try {
                callback(JSON.parse(body));
            } catch (error) {
                error.message = 'Failed to parse JSON from "' + url +'".\nError: ' + error.message;
                endJob(3, error);
            }

        });

    }).on('error', function (error) {
        endJob(3, error);
    });

}

function getJob(jobs, id) {

    var result;

    jobs.some(function (job) {
        if ( job.id === id ) {
            result = job;
            return true;
        }
        return false;
    });

    return result;

}

function getJobData(jobList) {

    var currentJob;
    var undoneJobs;

    if ( jobList.index < jobList.jobs.length ) {

        currentJob = jobList.jobs[jobList.index];
        jobList.index++;

        if ( currentJob.id === travis.CURRENT_JOB_ID ||
                currentJob.finished_at !== null && currentJob.result !== null ) {

            getJobData(jobList);

        } else {

            getJSON(travis.API_JOBS_URL + currentJob.id, function (data) {

                var jobLog = data.log;

                // If written, get the result of the job from
                // the special token written within its log.

                if ( jobLog.indexOf(generateToken(currentJob.id, configs.keys.SUCCESS)) !== -1 ) {
                    currentJob.result = 0;
                } else if ( jobLog.indexOf(generateToken(currentJob.id, configs.keys.FAILURE)) !== -1 ) {
                    currentJob.result = 1;
                }

                currentJob.finished_at = data.finished_at;

                getJobData(jobList);

            });

        }

    } else {
        handleJob(jobList.jobs);
    }

}

function getJobNumbersOfUndoneJobs(jobs) {

    var undoneJobs = [];

    jobs.forEach(function (job) {
        if ( job.finished_at === null ) {
            undoneJobs.push(job.number);
        }
    });

    return undoneJobs;

}

function getPreviousJobs(jobs, id) {

    var result = [];

    jobs.some(function (job) {

        if ( job.id === id ) {
            return true;
        }

        result.push(job);
        return false;

    });

    return result;

}

function log(msg) {
    console.log('%s %s', configs.LOG_PREFIX, msg);
}

function logJobResult(job) {

    var msg = '';
    var token;


    // Create a special token based on the result of the job (this
    // is done so that the chance of that text existing in the log
    // is minimal / non-existent).

    if ( travis.CURRENT_JOB_TEST_RESULT === 0 ) {
        token = generateToken(travis.CURRENT_JOB_ID, configs.keys.SUCCESS);
        msg += 'Job succeeded (' + token + ')';
    } else {
        token = generateToken(travis.CURRENT_JOB_ID, configs.keys.FAILURE);
        msg += 'Job failed (' + token + ')';
    }


    // If the token is already present in the log, don't write
    // it again (this is done in order to reduce the output in
    // the case where this script is executed multiple times -
    // e.g.: the user uses multiple scripts that include this
    // script).

    if ( job.log.indexOf(token) === -1 ) {
        log(msg);
    }

}

function removeJob(jobs, id) {

    var result = [];

    jobs.forEach(function (job) {
        if ( job.id !== id ) {
            result.push(job);
        }
    });

    return result;

}

function thereIsAFailingJob(jobs)  {
    return jobs.some(function (job) {
        return job.result === 1 && job.allow_failure === false;
    });
}

function thereIsASuccessfulJob(jobs)  {
    return jobs.some(function (job) {
        return job.result === 0;
    });
}

function waitThenGetJobData(jobs) {

    var jobList = {
        index: 0,
        jobs: jobs
    };

    var undoneJobs = getJobNumbersOfUndoneJobs(removeJob(jobList.jobs, travis.CURRENT_JOB_ID));

    if ( undoneJobs.length !== 0 ) {
        log('Waiting for ' + undoneJobs.join(', ').replace(/,(?!.*,)/, ' and') + ' to be done...');
    }

    // If the jobs take longer to be done, gradually increase
    // the check interval time up to the specified limit.

    configs.checkInterval = ( configs.checkInterval * 2 > configs.CHECK_INTERVAL_LIMIT ?
                                configs.CHECK_INTERVAL_LIMIT : configs.checkInterval * 2 );

    setTimeout(function () {
        getJobData(jobList);
    }, configs.checkInterval);

}

// ---------------------------------------------------------------------

// Conventions:
//
//  * For builds that failed, or for builds that succeeded but had
//    all their jobs failed but being allowed to fail), the first
//    job will be assign to run the user defined fail tasks.
//
//  * For builds that succeeded, the first successful job will be
//    assign to run the user defined success tasks.

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function handleJob(jobs) {

    var currentJob = getJob(jobs, travis.CURRENT_JOB_ID);

    if ( currentJob.result === 1 ) {

        if ( currentJob.allow_failure === false ) {
            handleFailingJob(currentJob, jobs);
        } else {
            handleFailingJobAllowedToFail(currentJob, jobs);
        }

    } else {
        handleSuccessfulJob(currentJob, jobs);
    }

}

function handleFailingJob(currentJob, jobs) {

    // Since the current job failed, the build also failed, therefore,
    // the current job can be ended with the appropriate code.

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var firstJob = jobs[0];


    // If the current job is the first one in the build, assign it
    // to run the user defined fail tasks.

    if ( currentJob.id === firstJob.id )  {
        endJob(1);

    // Otherwise, don't assign it to do anything as the first job
    // in the build will be assign to run the user defined fail tasks.

    } else {
        endJob(2);
    }

}

function handleFailingJobAllowedToFail(currentJob, jobs) {

    // Since the current job failed, but it was allowed to fail,
    // the status of the build is unknown, therefore, the current
    // job can only be ended with the appropriate code if there is
    // enough information about the status of the other jobs.

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var firstJob = jobs[0];
    var otherJobs = removeJob(jobs, currentJob.id);


    if ( currentJob.id === firstJob.id )  {

        // If there is at least one job that failed, the build
        // failed, therefore, assign the current job to run the
        // user defined fail tasks.

        if ( thereIsAFailingJob(otherJobs) ) {
            endJob(1);

        // Otherwise

        } else {

            // Note: By this point it is known that currently there
            // aren't any jobs that were not allowed to fail and did
            // fail.

            if ( allJobsAreDone(otherJobs) ) {

                // If there is a successful job, that job will be
                // assigned to run the user defined success tasks,
                // therefore, the current job doesn't need to be
                // assigned to do anything.

                if ( thereIsASuccessfulJob(otherJobs) ) {
                    endJob(2);

                // Otherwise, there are only jobs that where allowed
                // to fail and all of them fail, therefore, the build
                // failed, so assign the current job to run the user
                // defined fail tasks.

                } else {
                    endJob(1);
                }

            // If this point is reached, it means a decision cannot
            // be made because there isn't enough information. So, we
            // need to wait a bit, check the status of the other jobs,
            // and try again.

            } else {
                waitThenGetJobData(jobs);
            }

        }

    // If the current job is not the first job, no matter what the
    // status of build will be, this job won't be assign to do any
    // tasks (if the build failed, the first job will be assign to
    // do the fail tasks, and if the build succeeded, the first
    // successful job will be assigned to do the success tasks)

    } else {
        endJob(2);
    }

}

function handleSuccessfulJob(currentJob, jobs) {

    // Since the current job is a successful job, the status of the
    // build is unknown, therefore, the current job can only be ended
    // with the appropriate code if there is enough information about
    // the status of the other jobs

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var firstJob = jobs[0];
    var otherJobs = removeJob(jobs, currentJob.id);
    var previousJobs = getPreviousJobs(jobs, currentJob.id);


    // If a job failed, it means the build failed, therefore,

    if ( thereIsAFailingJob(otherJobs) ) {

        // If the current job is the first one in the build, assign
        // it to run the user defined fail tasks.

        if ( currentJob.id === firstJob.id )  {
            endJob(1);

        // Otherwise, don't assign it to do anything as the first
        // job in the build will be assign to run the user defined
        // fail tasks.

        } else {
            endJob(2);
        }

    } else {

        // If there is a previous successful job, no matter what the
        // status of the build will be, this job won't be assign to do
        // any tasks (if the build succeeded a previous successful job
        // will be assigned to do the success tasks, and if the build
        // fails, the first job in the build will be assign to do the
        // fail tasks).

        if ( thereIsASuccessfulJob(previousJobs) ) {
            endJob(2);

        } else {

            // Note: By this point it is known that currently there
            // aren't any jobs that were not allowed to fail and did
            // fail, or any previous successful jobs.

            // If all jobs are done, it means the current job
            // is the first successful job in a successful build,
            // therefore, assign it to run the success tasks.

            if ( allJobsAreDone(otherJobs) ) {
                endJob(0);

            // If this point is reached, it means a decision cannot
            // be made because there isn't enough information. So, we
            // need to wait a bit, check the status of the other jobs,
            // and try again.

            } else {
                waitThenGetJobData(jobs);
            }

        }
    }

}

// ---------------------------------------------------------------------

function main(callback) {

    configs.callback = callback;

    getJSON(travis.API_JOBS_URL + travis.CURRENT_JOB_ID, function (data) {

        // Write the result of current job in its log if it isn't
        // written already (this needs to be done because there isn't
        // any other way for the other jobs to know the result of the
        // current job without it actually be finished).

        logJobResult(data);

        // Get the list of jobs for this build and start checking for
        // their results.

        getBuildData();

    });

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Based on how this script is called,
// invoke `main` differentlly.

// 1) If this script is called directly:

if ( require.main === module ||
     module.parent === undefined ) {

    main();

// 2) If it's required as a module:

} else {
    module.exports = main;
}
