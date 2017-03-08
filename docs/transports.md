# Wilkins Transports

In `wilkins` a transport is essentially a storage device for your logs. Each instance of a wilkins logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file.

There are several [core transports](#wilkins-core) included in `wilkins`, which leverage the built-in networking and file I/O offered by node.js core. In addition, there are [third-party transports which are supported by the wilkins core team](#wilkins-more). And last (but not least) there are [additional transports written by members of the community](#additional-transports).

* **[Wilkins Core](#wilkins-core)**
  * [Console](#console-transport)
  * [File](#file-transport)
  * [Http](#http-transport)

* **[Wilkins More](#wilkins-more)**
  * [CouchDB](#couchdb-transport)
  * [Loggly](#loggly-transport)
  * [MongoDB](#mongodb-transport)
  * [Redis](#redis-transport)
  * [Riak](#riak-transport)

* **[Additional Transports](#additional-transports)**
  * [Elasticsearch](#elasticsearch-transport)
  * [SimpleDB](#simpledb-transport)
  * [Mail](#mail-transport)
  * [Amazon SNS](#amazon-sns-simple-notification-system-transport)
  * [Amazon CloudWatch](#amazon-cloudwatch-transport)
  * [Amazon Kinesis Firehose](#amazon-kinesis-firehose-transport)
  * [Graylog2](#graylog2-transport)
  * [Cassandra](#cassandra-transport)
  * [Azure Table](#azure-table)
  * [Airbrake](#airbrake-transport)
  * [Newrelic](#newrelic-transport) (errors only)
  * [Logsene](#logsene-transport) (including Log-Alerts and Anomaly Detection)
  * [Logz.io](#logzio-transport)

## Wilkins Core

There are several core transports included in `wilkins`, which leverage the built-in networking and file I/O offered by node.js core.

* [Console](#console-transport)
* [File](#file-transport)
* [Http](#http-transport)

### Console Transport

``` js
  wilkins.add(wilkins.transports.Console, options)
```

The Console transport takes a few simple options:

* __level:__ Level of messages that this transport should log (default 'info').
* __silent:__ Boolean flag indicating whether to suppress output (default false).
* __colorize:__ Boolean flag indicating if we should colorize output (default false).
* __timestamp:__ Boolean flag indicating if we should prepend output with timestamps (default false). If function is specified, its return value will be used instead of timestamps.
* __json:__ Boolean flag indicating whether or not the output should be JSON. If true, will log out multi-line JSON objects. (default false)
* __stringify:__ Boolean flag indiciating if the output should be passed through JSON.stringify, resulting in single-line output. Most useful when used in conjunction with the json flag. (default false)
* __prettyPrint:__ Boolean flag indicating if we should `util.inspect` the meta (default false). If function is specified, its return value will be the string representing the meta.
* __depth__ Numeric indicating how many times to recurse while formatting the object with `util.inspect` (only used with `prettyPrint: true`) (default null, unlimited)
* __humanReadableUnhandledException__ Boolean flag indicating if uncaught exception should be output as human readable, instead of a single line
* __showLevel:__ Boolean flag indicating if we should prepend output with level (default true).
* __formatter:__ If function is specified, its return value will be used instead of default output. (default undefined)
* __stderrLevels__ Array of strings containing the levels to log to stderr instead of stdout, for example `['error', 'debug', 'info']`. (default `['error', 'debug']`)
* (Deprecated: Use __stderrLevels__ instead) __debugStdout:__ Boolean flag indicating if 'debug'-level output should be redirected to stdout instead of to stderr. Cannot be used with __stderrLevels__. (default false)

*Metadata:* Logged via util.inspect(meta);

### File Transport
``` js
  wilkins.add(wilkins.transports.File, options)
```

The File transport should really be the 'Stream' transport since it will accept any [WritableStream][0]. It is named such because it will also accept filenames via the 'filename' option:

* __level:__ Level of messages that this transport should log.
* __silent:__ Boolean flag indicating whether to suppress output.
* __colorize:__ Boolean flag indicating if we should colorize output.
* __timestamp:__ Boolean flag indicating if we should prepend output with timestamps (default true). If function is specified, its return value will be used instead of timestamps.
* __filename:__ The filename of the logfile to write output to.
* __maxsize:__ Max size in bytes of the logfile, if the size is exceeded then a new file is created, a counter will become a suffix of the log file.
* __maxFiles:__ Limit the number of files created when the size of the logfile is exceeded.
* __stream:__ The WriteableStream to write output to.
* __json:__ If true, messages will be logged as JSON (default true).
* __eol:__ string indicating the end-of-line characters to use (default to `\n`).
* __prettyPrint:__ If true, additional JSON metadata objects that are added to logging string messages will be displayed as a JSON string representation. If function is specified, its return value will be the string representing the meta.
* __depth__ Numeric indicating how many times to recurse while formatting the object with `util.inspect` (only used with `prettyPrint: true`) (default null, unlimited)
* __logstash:__ If true, messages will be logged as JSON and formatted for logstash (default false).
* __showLevel:__ Boolean flag indicating if we should prepend output with level (default true).
* __formatter:__ If function is specified and `json` is set to `false`, its return value will be used instead of default output. (default undefined)
* __tailable:__ If true, log files will be rolled based on maxsize and maxfiles, but in ascending order. The __filename__ will always have the most recent log lines. The larger the appended number, the older the log file.  This option requires __maxFiles__ to be set, or it will be ignored.
* __maxRetries:__ The number of stream creation retry attempts before entering a failed state. In a failed state the transport stays active but performs a NOOP on it's log function. (default 2)
* __zippedArchive:__ If true, all log files but the current one will be zipped.
* __options:__ options passed to `fs.createWriteStream` (default `{flags: 'a'}`).

*Metadata:* Logged via util.inspect(meta);

### Http Transport

``` js
  wilkins.add(wilkins.transports.Http, options)
```

The `Http` transport is a generic way to log, query, and stream logs from an arbitrary Http endpoint, preferably [wilkinsd][1]. It takes options that are passed to the node.js `http` or `https` request:

* __host:__ (Default: **localhost**) Remote host of the HTTP logging endpoint
* __port:__ (Default: **80 or 443**) Remote port of the HTTP logging endpoint
* __path:__ (Default: **/**) Remote URI of the HTTP logging endpoint
* __auth:__ (Default: **None**) An object representing the `username` and `password` for HTTP Basic Auth
* __ssl:__ (Default: **false**) Value indicating if we should us HTTPS

## Wilkins More

Starting with `wilkins@0.3.0` an effort was made to remove any transport which added additional dependencies to `wilkins`. At the time there were several transports already in `wilkins` which will **always be supported by the wilkins core team.**

* [CouchDB](#couchdb-transport)
* [Redis](#redis-transport)
* [MongoDB](#mongodb-transport)
* [Riak](#riak-transport)
* [Loggly](#loggly-transport)

### CouchDB Transport

_As of `wilkins@0.6.0` the CouchDB transport has been broken out into a new module: [wilkins-couchdb][2]._

``` js
  wilkins.add(wilkins.transports.Couchdb, options)
```

The `Couchdb` will place your logs in a remote CouchDB database. It will also create a [Design Document][3], `_design/Logs` for later querying and streaming your logs from CouchDB. The transport takes the following options:

* __host:__ (Default: **localhost**) Remote host of the HTTP logging endpoint
* __port:__ (Default: **5984**) Remote port of the HTTP logging endpoint
* __db:__ (Default: **wilkins**) Remote URI of the HTTP logging endpoint
* __auth:__ (Default: **None**) An object representing the `username` and `password` for HTTP Basic Auth
* __ssl:__ (Default: **false**) Value indicating if we should us HTTPS

### Redis Transport

``` js
  wilkins.add(wilkins.transports.Redis, options)
```

This transport accepts the options accepted by the [node-redis][4] client:

* __host:__ (Default **localhost**) Remote host of the Redis server
* __port:__ (Default **6379**) Port the Redis server is running on.
* __auth:__ (Default **None**) Password set on the Redis server

In addition to these, the Redis transport also accepts the following options.

* __length:__ (Default **200**) Number of log messages to store.
* __container:__ (Default **wilkins**) Name of the Redis container you wish your logs to be in.
* __channel:__ (Default **None**) Name of the Redis channel to stream logs from.

*Metadata:* Logged as JSON literal in Redis

### Loggly Transport

_As of `wilkins@0.6.0` the Loggly transport has been broken out into a new module: [wilkins-loggly][5]._

``` js
  wilkins.add(wilkins.transports.Loggly, options);
```

The Loggly transport is based on [Nodejitsu's][6] [node-loggly][7] implementation of the [Loggly][8] API. If you haven't heard of Loggly before, you should probably read their [value proposition][9]. The Loggly transport takes the following options. Either 'inputToken' or 'inputName' is required:

* __level:__ Level of messages that this transport should log.
* __subdomain:__ The subdomain of your Loggly account. *[required]*
* __auth__: The authentication information for your Loggly account. *[required with inputName]*
* __inputName:__ The name of the input this instance should log to.
* __inputToken:__ The input token of the input this instance should log to.
* __json:__ If true, messages will be sent to Loggly as JSON.

*Metadata:* Logged in suggested [Loggly format][10]


### Logzio Transport

You can download the logzio transport here : [https://github.com/logzio/wilkins-logzio](https://github.com/logzio/wilkins-logzio)  

*Basic Usage*  
```js
var wilkins = require('wilkins');
var logzioWilkinsTransport = require('wilkins-logzio');

var loggerOptions = {
    token: '__YOUR_API_TOKEN__'
};
wilkins.add(logzioWilkinsTransport, loggerOptions);

wilkins.log('info', 'wilkins logger configured with logzio transport');
```

For more information about how to configure the logzio transport, view the README.md in the [wilkins-logzio repo](https://github.com/logzio/wilkins-logzio).


### Riak Transport

_As of `wilkins@0.3.0` the Riak transport has been broken out into a new module: [wilkins-riak][11]._ Using it is just as easy:

``` js
  var Riak = require('wilkins-riak').Riak;
  wilkins.add(Riak, options);
```

In addition to the options accepted by the [riak-js][12] [client][13], the Riak transport also accepts the following options. It is worth noting that the riak-js debug option is set to *false* by default:

* __level:__ Level of messages that this transport should log.
* __bucket:__ The name of the Riak bucket you wish your logs to be in or a function to generate bucket names dynamically.

``` js
  // Use a single bucket for all your logs
  var singleBucketTransport = new (Riak)({ bucket: 'some-logs-go-here' });

  // Generate a dynamic bucket based on the date and level
  var dynamicBucketTransport = new (Riak)({
    bucket: function (level, msg, meta, now) {
      var d = new Date(now);
      return level + [d.getDate(), d.getMonth(), d.getFullYear()].join('-');
    }
  });
```

*Metadata:* Logged as JSON literal in Riak

### MongoDB Transport

As of `wilkins@0.3.0` the MongoDB transport has been broken out into a new module: [wilkins-mongodb][14]. Using it is just as easy:

``` js
  var MongoDB = require('wilkins-mongodb').MongoDB;
  wilkins.add(MongoDB, options);
```

The MongoDB transport takes the following options. 'db' is required:

* __level:__ Level of messages that this transport should log.
* __silent:__ Boolean flag indicating whether to suppress output.
* __db:__ The name of the database you want to log to. *[required]*
* __collection__: The name of the collection you want to store log messages in, defaults to 'log'.
* __safe:__ Boolean indicating if you want eventual consistency on your log messages, if set to true it requires an extra round trip to the server to ensure the write was committed, defaults to true.
* __host:__ The host running MongoDB, defaults to localhost.
* __port:__ The port on the host that MongoDB is running on, defaults to MongoDB's default port.

*Metadata:* Logged as a native JSON object.

## Additional Transports

The community has truly embraced `wilkins`; there are over **23** wilkins transports and over half of them are maintained by authors external to the wilkins core team. If you want to check them all out, just search `npm`:

``` bash
  $ npm search wilkins
```

**If you have an issue using one of these modules you should contact the module author directly**

### Elasticsearch Transport

Log to Elasticsearch in a logstash-like format and
leverage Kibana to browser your logs.

See: https://github.com/vanthome/wilkins-elasticsearch.

### SimpleDB Transport

The [wilkins-simpledb][15] transport is just as easy:

``` js
  var SimpleDB = require('wilkins-simpledb').SimpleDB;
  wilkins.add(SimpleDB, options);
```

The SimpleDB transport takes the following options. All items marked with an asterisk are required:

* __awsAccessKey__:* your AWS Access Key
* __secretAccessKey__:* your AWS Secret Access Key
* __awsAccountId__:* your AWS Account Id
* __domainName__:* a string or function that returns the domain name to log to
* __region__:* the region your domain resides in
* __itemName__: a string ('uuid', 'epoch', 'timestamp') or function that returns the item name to log

*Metadata:* Logged as a native JSON object to the 'meta' attribute of the item.

### Mail Transport

The [wilkins-mail][16] is an email transport:

``` js
  var Mail = require('wilkins-mail').Mail;
  wilkins.add(Mail, options);
```

The Mail transport uses [node-mail][17] behind the scenes.  Options are the following, `to` and `host` are required:

* __to:__ The address(es) you want to send to. *[required]*
* __from:__ The address you want to send from. (default: `wilkins@[server-host-name]`)
* __host:__ SMTP server hostname
* __port:__ SMTP port (default: 587 or 25)
* __secure:__ Use secure
* __username__ User for server auth
* __password__ Password for server auth
* __level:__ Level of messages that this transport should log.
* __silent:__ Boolean flag indicating whether to suppress output.

*Metadata:* Stringified as JSON in email.

### Amazon SNS (Simple Notification System) Transport

The [wilkins-sns][18] transport uses amazon SNS to send emails, texts, or a bunch of other notifications. Since this transport uses the Amazon AWS SDK for JavaScript, you can take advantage of the various methods of authentication found in Amazon's [Configuring the SDK in Node.js](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html) document.

``` js
  var wilkins = require('wilkins'),
      wilkinsSNS = require('wilkins-sns');

  wilkins.add(wilkinsSNS, options);
```

Options:

* __subscriber:__ Subscriber number - found in your SNS AWS Console, after clicking on a topic. Same as AWS Account ID. *[required]*
* __topic_arn:__ Also found in SNS AWS Console - listed under a topic as Topic ARN. *[required]*
* __aws_key:__ Your Amazon Web Services Key.
* __aws_secret:__ Your Amazon Web Services Secret.
* __region:__ AWS Region to use. Can be one of: `us-east-1`,`us-west-1`,`eu-west-1`,`ap-southeast-1`,`ap-northeast-1`,`us-gov-west-1`,`sa-east-1`. (default: `us-east-1`)
* __subject:__ Subject for notifications. Uses placeholders for level (%l), error message (%e), and metadata (%m). (default: "Wilkins Error Report")
* __message:__ Message of notifications. Uses placeholders for level (%l), error message (%e), and metadata (%m). (default: "Level '%l' Error:\n%e\n\nMetadata:\n%m")
* __level:__ lowest level this transport will log. (default: `info`)
* __json:__ use json instead of a prettier (human friendly) string for meta information in the notification. (default: `false`)
* __handleExceptions:__ set to true to have this transport handle exceptions. (default: `false`)

### Amazon CloudWatch Transport

The [wilkins-aws-cloudwatch][25] transport relays your log messages to Amazon CloudWatch.

```js
  var wilkins = require('wilkins'),
      wilkinsAwsCloudWatch = require('wilkins-aws-cloudwatch');

  wilkins.add(wilkinsAwsCloudWatch, options);
```

Options:

* __logGroupName:__ The name of the CloudWatch log group to which to log. *[required]*
* __logStreamName:__ The name of the CloudWatch log stream to which to log. *[required]*
* __awsConfig:__ An object containing your `accessKeyId`, `secretAccessKey`, `region`, etc.

Alternatively, you may be interested in [wilkins-cloudwatch][26].

### Amazon Kinesis Firehose Transport

The [wilkins-firehose][28] transport relays your log messages to Amazon Kinesis Firehose.

```js
  var wilkins = require('wilkins');
  var WFirehose = require('wilkins-firehose');

  wilkins.add(WFirehose, options);
```

Options:

* __streamName:__ The name of the Amazon Kinesis Firehose stream to which to log. *[required]*
* __firehoseOptions:__ The AWS Kinesis firehose options to pass direction to the firehose client, [as documented by AWS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#constructor-property). *[required]*


### Amazon DynamoDB Transport
The [wilkins-dynamodb][26] transport uses Amazon's DynamoDB as a sink for log messages. You can take advantage of the various authentication methods supports by Amazon's aws-sdk module. See [Configuring the SDK in Node.js](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html).

``` js
  var wilkins = require('wilkins'),
      wilkinsDynamo = require("wilkins-dynamodb");

  wilkinsDynamo.DynamoDB;
  wilkins.add(wilkins.transports.DynamoDB, options)
```

Options:
* __accessKeyId:__ your AWS access key id
* __secretAccessKey:__ your AWS secret access key
* __region:__ the region where the domain is hosted
* __useEnvironment:__ use process.env values for AWS access, secret, & region.
* __tableName:__ DynamoDB table name

To Configure using environment authentication:
``` js
  var options = {
    useEnvironment: true,
    tableName: 'log'
  };
  wilkins.add(wilkins.transports.DynamoDB, options);
```

Also supports callbacks for completion when the DynamoDB putItem has been compelted.

### Papertrail Transport

[wilkins-papertrail][27] is a Papertrail transport:

``` js
  var Papertrail = require('wilkins-papertrail').Papertrail;
  wilkins.add(Papertrail, options);
```

The Papertrail transport connects to a [PapertrailApp log destination](https://papertrailapp.com) over TCP (TLS) using the following options:

* __level:__ Level of messages this transport should log. (default: info)
* __host:__ FQDN or IP address of the Papertrail endpoint.
* __port:__ Port for the Papertrail log destination.
* __hostname:__ The hostname associated with messages. (default: require('os').hostname())
* __program:__ The facility to send log messages.. (default: default)
* __logFormat:__ a log formatting function with the signature `function(level, message)`, which allows custom formatting of the level or message prior to delivery

*Metadata:* Logged as a native JSON object to the 'meta' attribute of the item.

### Graylog2 Transport

[wilkins-graylog2][19] is a Graylog2 transport:

``` js
  var wilkins = require('wilkins');
  wilkins.add(require('wilkins-graylog2'), options);
```

The Graylog2 transport connects to a Graylog2 server over UDP using the following options:

* __name__:  Transport name
* __level__: Level of messages this transport should log. (default: info)
* __silent__: Boolean flag indicating whether to suppress output. (default: false)
* __handleExceptions__: Boolean flag, whenever to handle uncaught exceptions. (default: false)
* __graylog__:
  - __servers__; list of graylog2 servers
    * __host__: your server address (default: localhost)
    * __port__: your server port (default: 12201)
  - __hostname__: the name of this host (default: os.hostname())
  - __facility__: the facility for these log messages (default: "Node.js")
  - __bufferSize__: max UDP packet size, should never exceed the MTU of your system (default: 1400)

### Cassandra Transport

[wilkins-cassandra][20] is a Cassandra transport:

``` js
  var Cassandra = require('wilkins-cassandra').Cassandra;
  wilkins.add(Cassandra, options);
```

The Cassandra transport connects to a cluster using the native protocol with the following options:

* __level:__ Level of messages that this transport should log (default: `'info'`).
* __table:__ The name of the Cassandra column family you want to store log messages in (default: `'logs'`).
* __partitionBy:__ How you want the logs to be partitioned. Possible values `'hour'` and `'day'`(Default).
* __consistency:__ The consistency of the insert query (default: `quorum`).

In addition to the options accepted by the [Node.js Cassandra driver](https://github.com/jorgebay/node-cassandra-cql) Client.

* __hosts:__ Cluster nodes that will handle the write requests:
Array of strings containing the hosts, for example `['host1', 'host2']` (required).
* __keyspace:__ The name of the keyspace that will contain the logs table (required). The keyspace should be already created in the cluster.

### Azure Table

[wilkins-azuretable][21] is a Azure Table transport:

``` js
  var azureLogger = require('wilkins-azuretable').AzureLogger
  wilkins.add(azureLogger, options);
```

The Azure Table transport connects to an Azure Storage Account using the following options:

* __useDevStorage__: Boolean flag denoting whether to use the Azure Storage Emulator (default: `false`)
* __account__: Azure Storage Account Name. In lieu of this setting, you can set the environment variable: `AZURE_STORAGE_ACCOUNT`
* __key__: Azure Storage Account Key. In lieu of this setting, you can set the environment variable: `AZURE_STORAGE_ACCESS_KEY`
* __level__: lowest logging level transport to be logged (default: `info`)
* __tableName__: name of the table to log messages (default: `log`)
* __partitionKey__: table partition key to use (default: `process.env.NODE_ENV`)
* __silent__: Boolean flag indicating whether to suppress output (default: `false`)

### Airbrake Transport

[wilkins-airbrake2][22] is a transport for wilkins that sends your logs to Airbrake.io.

``` js
  var wilkins = require('wilkins');
  wilkins.add(require('wilkins-airbrake2').Airbrake, options);
```

The Airbrake transport utilises the node-airbrake module to send logs to the Airbrake.io API. You can set the following options:

* __apiKey__: The project API Key. (required, default: null)
* __name__: Transport name. (optional, default: 'airbrake')
* __level__: The level of message that will be sent to Airbrake (optional, default: 'error')
* __host__: The information that is displayed within the URL of the Airbrake interface. (optional, default: 'http://' + os.hostname())
* __env__: The environment will dictate what happens with your message. If your environment is currently one of the 'developmentEnvironments', the error will not be sent to Airbrake. (optional, default: process.env.NODE_ENV)
* __timeout__: The maximum time allowed to send to Airbrake in milliseconds. (optional, default: 30000)
* __developmentEnvironments__: The environments that will **not** send errors to Airbrake. (optional, default: ['development', 'test'])
* __projectRoot__: Extra string sent to Airbrake. (optional, default: null)
* __appVersion__: Extra string or number sent to Airbrake. (optional, default: null)
* __consoleLogError__: Toggle the logging of errors to console when the current environment is in the developmentEnvironments array. (optional, default: false)

### Winlog2 Transport

[wilkins-winlog2][19] is a Windows Event log transport:

``` js
  var wilkins = require('wilkins');
  wilkins.add(require('wilkins-winlog2'), options);
```

The winlog2 transport uses the following options:

* __name__:  Transport name
* __eventLog__: Log type (default: 'APPLICATION')
* __source__: Name of application which will appear in event log (default: 'node')

### Newrelic Transport

[newrelic-wilkins][23] is a Newrelic transport:

``` js
  var wilkins = require('wilkins');
  wilkins.add(require('newrelic-wilkins'), options);
```

The Newrelic transport will send your errors to newrelic and accepts the follwing optins:

* __env__:  the current evironment. Defatuls to `process.env.NODE_ENV`

If `env` is either 'dev' or 'test' the lib will _not_ load the included newrelic module saving devs from anoying errors ;)

### Logsene Transport

[wilkins-logsene][24] transport for Elasticsearch bulk indexing via HTTPS to Logsene:

``` js
  var wilkins = require('wilkins')
  var Logsene = require('wilkins-logsene')
  var logger = new wilkins.Logger()
  logger.add (Logsene, {token: process.env.LOGSENE_TOKEN})
  logger.info ("Info message no. %d logged to %s",1,'Logsene', {metadata: "test-log", count:1 , tags: ['test', 'info', 'wilkins'], memoryUsage: process.memoryUsage()})
```
Options:
* __token__: Logsene Application Token
* __source__: Source of the logs (defaults to main module)

[Logsene](http://www.sematext.com/logsene/) features:
- Fulltext search
- Anomaly detection and alerts
- Kibana4 integration
- Integration with [SPM Performance Monitoring for Node.js](http://www.sematext.com/spm/integrations/nodejs-monitoring.html)

## Find more Transports

``` bash
  $ npm search wilkins
  (...)
  wilkins-amon         Wilkins transport for Amon logging                            =zoramite
  wilkins-amqp         An AMQP transport for wilkins                                 =kr1sp1n
  wilkins-cassandra    A Cassandra transport for wilkins                             =jorgebay
  wilkins-couchdb      a couchdb transport for wilkins                               =alz
  wilkins-express      Express middleware to let you use wilkins from the browser.   =regality
  wilkins-graylog2     A graylog2 transport for wilkins                              =smithclay
  wilkins-hbase        A HBase transport for wilkins                                 =ddude
  wilkins-loggly       A Loggly transport for wilkins                                =indexzero
  wilkins-mail         A mail transport for wilkins                                  =wavded
  wilkins-mail2        A mail transport for wilkins                                  =ivolo
  wilkins-mongodb      A MongoDB transport for wilkins                               =indexzero
  wilkins-nodemail     A mail transport for wilkins                                  =reinpk
  wilkins-nssocket     nssocket transport for wilkins                                =mmalecki
  wilkins-papertrail   A Papertrail transport for wilkins                            =kenperkins
  wilkins-redis        A fixed-length Redis transport for wilkins                    =indexzero
  wilkins-riak         A Riak transport for wilkins                                  =indexzero
  wilkins-scribe       A scribe transport for wilkins                                =wnoronha
  wilkins-simpledb     A Wilkins transport for Amazon SimpleDB                       =chilts
  wilkins-skywriter    A Windows Azure table storage transport for wilkins           =pofallon
  wilkins-sns          A Simple Notification System Transport for wilkins            =jesseditson
  wilkins-syslog       A syslog transport for wilkins                                =indexzero
  wilkins-syslog-ain2  An ain2 based syslog transport for wilkins                    =lamtha
  wilkins-winlog       Windows Event Log logger for Wilkins                          =jfromaniello
  wilkins-winlog2      Windows Event Log logger for Wilkins (no node-gyp)            =peteward44
  wilkins-zmq          A 0MQ transport for wilkins                                   =dhendo
  wilkins-growl        A growl transport for wilkins                                 =pgherveou

```

[0]: https://nodejs.org/api/stream.html#stream_class_stream_writable
[1]: https://github.com/flatiron/wilkinsd
[2]: https://github.com/indexzero/wilkins-couchdb
[3]: http://guide.couchdb.org/draft/design.html
[4]: https://github.com/mranney/node_redis
[5]: https://github.com/indexzero/wilkins-loggly
[6]: http://nodejitsu.com
[7]: https://github.com/nodejitsu/node-loggly
[8]: http://loggly.com
[9]: http://www.loggly.com/product/
[10]: http://wiki.loggly.com/loggingfromcode
[11]: https://github.com/indexzero/wilkins-riak
[12]: http://riakjs.org
[13]: https://github.com/frank06/riak-js/blob/master/src/http_client.coffee#L10
[14]: http://github.com/indexzero/wilkins-mongodb
[15]: http://github.com/appsattic/wilkins-simpledb
[16]: http://github.com/wavded/wilkins-mail
[17]: https://github.com/weaver/node-mail
[18]: https://github.com/jesseditson/wilkins-sns
[19]: https://github.com/namshi/wilkins-graylog2
[20]: https://github.com/jorgebay/wilkins-cassandra
[21]: https://github.com/jpoon/wilkins-azuretable
[22]: https://github.com/rickcraig/wilkins-airbrake2
[23]: https://github.com/namshi/wilkins-newrelic
[24]: https://github.com/sematext/wilkins-logsene
[25]: https://github.com/timdp/wilkins-aws-cloudwatch
[26]: https://github.com/lazywithclass/wilkins-cloudwatch
[27]: https://github.com/kenperkins/wilkins-papertrail
[28]: https://github.com/pkallos/wilkins-firehose
