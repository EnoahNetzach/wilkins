## v2.3.1 / 2017-01-20
### WELCOME TO THE APOCALYPSE EDITION

- [#868](https://github.com/wilkinsjs/wilkins/pull/868), Fix 'Maximum call stack size exceeded' error with custom formatter.

## v2.3.0 / 2016-11-02
### ZOMG WHY WOULD YOU ASK EDITION

- Full `CHANGELOG.md` entry forthcoming. See [the `git` diff for `2.3.0`](https://github.com/wilkinsjs/wilkins/compare/2.2.0...2.3.0) for now.

## v2.2.0 / 2016-02-25
### LEAVING CALIFORNIA EDITION

- Full `CHANGELOG.md` entry forthcoming. See [the `git` diff for `2.2.0`](https://github.com/wilkinsjs/wilkins/compare/2.1.1...2.2.0) for now.

## v2.1.1 / 2015-11-18
### COLOR ME IMPRESSED EDITION

- [#751](https://github.com/wilkinsjs/wilkins/pull/751), Fix colors not appearing in non-tty environments. Fixes [#609](https://github.com/wilkinsjs/wilkins/issues/609), [#616](https://github.com/wilkinsjs/wilkins/issues/616), [#669](https://github.com/wilkinsjs/wilkins/issues/669), [#648](https://github.com/wilkinsjs/wilkins/issues/648) (`fiznool`).
- [#752](https://github.com/wilkinsjs/wilkins/pull/752)     Correct syslog RFC number. 5424 instead of 524. (`jbenoit2011`)

## v2.1.0 / 2015-11-03
### TEST ALL THE ECOSYSTEM EDITION

- [#742](https://github.com/wilkinsjs/wilkins/pull/742), [32d52b7](https://github.com/wilkinsjs/wilkins/commit/32d52b7) Distribute common test files used by transports in the `wilkins` ecosystem.

## v2.0.1 / 2015-11-02
### BUGS ALWAYS HAPPEN OK EDITION

- [#739](https://github.com/wilkinsjs/wilkins/issues/739), [1f16861](https://github.com/wilkinsjs/wilkins/commit/1f16861) Ensure that `logger.log("info", undefined)` does not throw.

## v2.0.0 / 2015-10-29
### OMG IT'S MY SISTER'S BIRTHDAY EDITION

#### Breaking changes

**Most important**
- **[0f82204](https://github.com/wilkinsjs/wilkins/commit/0f82204) Move `wilkins.transports.DailyRotateFile` [into a separate module](https://github.com/wilkinsjs/wilkins-daily-rotate-file)**: `require('wilkins-daily-rotate-file');`
- **[fb9eec0](https://github.com/wilkinsjs/wilkins/commit/fb9eec0) Reverse log levels in `npm` and `cli` configs to conform to [RFC524](https://tools.ietf.org/html/rfc5424). Fixes [#424](https://github.com/wilkinsjs/wilkins/pull/424) [#406](https://github.com/wilkinsjs/wilkins/pull/406) [#290](https://github.com/wilkinsjs/wilkins/pull/290)**
- **[8cd8368](https://github.com/wilkinsjs/wilkins/commit/8cd8368) Change the method signature to a `filter` function to be consistent with `rewriter` and log functions:**
``` js
function filter (level, msg, meta, inst) {
  // Filter logic goes here...
}
```

**Other breaking changes**
- [e0c9dde](https://github.com/wilkinsjs/wilkins/commit/e0c9dde) Remove `wilkins.transports.Webhook`. Use `wilkins.transports.Http` instead.
- [f71e638](https://github.com/wilkinsjs/wilkins/commit/f71e638) Remove `Logger.prototype.addRewriter` and `Logger.prototype.addFilter` since they just push to an Array of functions. Use `logger.filters.push` or `logger.rewriters.push` explicitly instead.
- [a470ab5](https://github.com/wilkinsjs/wilkins/commit/a470ab5) No longer respect the `handleExceptions` option to `new wilkins.Logger`. Instead just pass in the `exceptionHandlers` option itself.
- [8cb7048](https://github.com/wilkinsjs/wilkins/commit/8cb7048) Removed `Logger.prototype.extend` functionality

#### New features
- [3aa990c](https://github.com/wilkinsjs/wilkins/commit/3aa990c) Added `Logger.prototype.configure` which now contains all logic previously in the `wilkins.Logger` constructor function. (`indexzero`)
- [#726](https://github.com/wilkinsjs/wilkins/pull/726) Update .npmignore (`coreybutler`)
- [#700](https://github.com/wilkinsjs/wilkins/pull/700) Add an `eol` option to the `Console` transport. (`aquavitae`)
- [#731](https://github.com/wilkinsjs/wilkins/pull/731) Update `lib/transports.js` for better static analysis. (`indexzero`)

#### Fixes, refactoring, and optimizations. OH MY!
- [#632](https://github.com/wilkinsjs/wilkins/pull/632) Allow `File` transport to be an `objectMode` writable stream. (`stambata`)
- [#527](https://github.com/wilkinsjs/wilkins/issues/527), [163f4f9](https://github.com/wilkinsjs/wilkins/commit/163f4f9), [3747ccf](https://github.com/wilkinsjs/wilkins/commit/3747ccf) Performance optimizations and string interpolation edge cases (`indexzero`)
- [f0edafd](https://github.com/wilkinsjs/wilkins/commit/f0edafd) Code cleanup for reability, ad-hoc styleguide enforcement (`indexzero`)

## v1.1.1 - v1.1.2 / 2015-10
### MINOR FIXES EDITION

#### Notable changes
  * [727](https://github.com/wilkinsjs/wilkins/pull/727) Fix "raw" mode (`jcrugzz`)
  * [703](https://github.com/wilkinsjs/wilkins/pull/703) Do not modify Error or Date objects when logging. Fixes #610 (`harriha`).

## v1.1.0 / 2015-10-09
### GREETINGS FROM CARTAGENA EDITION

#### Notable Changes
  * [#721](https://github.com/wilkinsjs/wilkins/pull/721) Fixed octal literal to work with node 4 strict mode (`wesleyeff`)
  * [#630](https://github.com/wilkinsjs/wilkins/pull/630) Add stderrLevels option to Console Transport and update docs (`paulhroth`)
  * [#626](https://github.com/wilkinsjs/wilkins/pull/626) Add the logger (this) in the fourth argument in the rewriters and filters functions (`christophehurpeau `)
  * [#623](https://github.com/wilkinsjs/wilkins/pull/623) Fix Console Transport's align option tests (`paulhroth`, `kikobeats`)
  * [#692](https://github.com/wilkinsjs/wilkins/pull/692) Adding wilkins-aws-cloudwatch to transport docs (`timdp`)

## v1.0.2 2015-09-25
### LET'S TALK ON GITTER EDITION

#### Notable Changes
  * [de80160](https://github.com/wilkinsjs/wilkins/commit/de80160) Add Gitter badge (`The Gitter Badger`)
  * [44564de](https://github.com/wilkinsjs/wilkins/commit/44564de) [fix] Correct listeners in `logException`. Fixes [#218](https://github.com/wilkinsjs/wilkins/issues/218) [#213](https://github.com/wilkinsjs/wilkins/issues/213) [#327](https://github.com/wilkinsjs/wilkins/issues/327). (`indexzero`)
  * [45b1eeb](https://github.com/wilkinsjs/wilkins/commit/45b1eeb) [fix] Get `tailFile` function working on latest/all node versions (`Christopher Jeffrey`)
  * [c6d45f9](https://github.com/wilkinsjs/wilkins/commit/c6d45f9) Fixed event subscription on close (`Roman Stetsyshin`)

#### Other changes
  * TravisCI updates & best practices [87b97cc](https://github.com/wilkinsjs/wilkins/commit/87b97cc) [91a5bc4](https://github.com/wilkinsjs/wilkins/commit/91a5bc4), [cf24e6a](https://github.com/wilkinsjs/wilkins/commit/cf24e6a) (`indexzero`)
  * [d5397e7](https://github.com/wilkinsjs/wilkins/commit/d5397e7) Bump async version (`Roderick Hsiao`)
  * Documentation updates & fixes [86d7527](https://github.com/wilkinsjs/wilkins/commit/86d7527), [38254c1](https://github.com/wilkinsjs/wilkins/commit/38254c1), [04e2928](https://github.com/wilkinsjs/wilkins/commit/04e2928), [61c8a89](https://github.com/wilkinsjs/wilkins/commit/61c8a89), [c42a783](https://github.com/wilkinsjs/wilkins/commit/c42a783), [0688a22](https://github.com/wilkinsjs/wilkins/commit/0688a22), [eabc113](https://github.com/wilkinsjs/wilkins/commit/eabc113) [c9506b7](https://github.com/wilkinsjs/wilkins/commit/c9506b7), [17534d2](https://github.com/wilkinsjs/wilkins/commit/17534d2), [b575e7b](https://github.com/wilkinsjs/wilkins/commit/b575e7b) (`Stefan Thies`, `charukiewicz`, `unLucio`, `Adam Cohen`, `Denis Gorbachev`, `Frederik Ring`, `Luigi Pinca`, `jeffreypriebe`)
  * Documentation refactor & cleanup [a19607e](https://github.com/wilkinsjs/wilkins/commit/a19607e), [d1932b4](https://github.com/wilkinsjs/wilkins/commit/d1932b4), [7a13132](https://github.com/wilkinsjs/wilkins/commit/7a13132) (`indexzero`)


## v1.0.1 / 2015-06-26
### YAY DOCS EDITION

  * [#639](https://github.com/wilkinsjs/wilkins/pull/639) Fix for [#213](https://github.com/wilkinsjs/wilkins/issues/213): More than 10 containers triggers EventEmitter memory leak warning (`marcus`)
  * Documentation and `package.json` updates [cec892c](https://github.com/wilkinsjs/wilkins/commit/cec892c), [2f13b4f](https://github.com/wilkinsjs/wilkins/commit/2f13b4f), [b246efd](https://github.com/wilkinsjs/wilkins/commit/b246efd), [22a5f5a](https://github.com/wilkinsjs/wilkins/commit/22a5f5a), [5868b78](https://github.com/wilkinsjs/wilkins/commit/5868b78), [99b6b44](https://github.com/wilkinsjs/wilkins/commit/99b6b44), [447a813](https://github.com/wilkinsjs/wilkins/commit/447a813), [7f75b48](https://github.com/wilkinsjs/wilkins/commit/7f75b48) (`peteward44`, `Gilad Peleg`, `Anton Ian Sipos`, `nimrod-becker`, `LarsTi`, `indexzero`)

## v1.0.0 / 2015-04-07
### OMG 1.0.0 FINALLY EDITION

#### Breaking Changes
  * [#587](https://github.com/wilkinsjs/wilkins/pull/587) Do not extend `String` prototypes as a side effect of using `colors`. (`kenperkins`)
  * [#581](https://github.com/wilkinsjs/wilkins/pull/581) File transports now emit `error` on error of the underlying streams after `maxRetries` attempts. (`ambbell`).
  * [#583](https://github.com/wilkinsjs/wilkins/pull/583), [92729a](https://github.com/wilkinsjs/wilkins/commit/92729a68d71d07715501c35d94d2ac06ac03ca08) Use `os.EOL` for all file writing by default. (`Mik13`, `indexzero`)
  * [#532](https://github.com/wilkinsjs/wilkins/pull/532) Delete logger instance from `Container` when `close` event is emitted. (`snater`)
  * [#380](https://github.com/wilkinsjs/wilkins/pull/380) Rename `duration` to `durationMs`, which is now a number a not a string ending in `ms`. (`neoziro`)
  * [#253](https://github.com/wilkinsjs/wilkins/pull/253) Do not set a default level. When `level` is falsey on any `Transport` instance, any `Logger` instance uses the configured level (instead of the Transport level) (`jstamerj`).

#### Other changes

  * [b83de62](https://github.com/wilkinsjs/wilkins/commit/b83de62) Fix rendering of stack traces.
  * [c899cc](https://github.com/wilkinsjs/wilkins/commit/c899cc1f0719e49b26ec933e0fa263578168ea3b) Update documentation (Fixes [#549](https://github.com/wilkinsjs/wilkins/issues/549))
  * [#551](https://github.com/wilkinsjs/wilkins/pull/551) Filter metadata along with messages
  * [#578](https://github.com/wilkinsjs/wilkins/pull/578) Fixes minor issue with `maxFiles` in `File` transport (Fixes [#556](https://github.com/wilkinsjs/wilkins/issues/556)).
  * [#560](https://github.com/wilkinsjs/wilkins/pull/560) Added `showLevel` support to `File` transport.
  * [#558](https://github.com/wilkinsjs/wilkins/pull/558) Added `showLevel` support to `Console` transport.

## v0.9.0 / 2015-02-03

  * [#496](https://github.com/flatiron/wilkins/pull/496) Updated default option handling for CLI (`oojacoboo`).
  * [f37634b](https://github.com/flatiron/wilkins/commit/f37634b) [dist] Only support `node >= 0.8.0`. (`indexzero`)
  * [91a1e90](https://github.com/flatiron/wilkins/commit/91a1e90), [50163a0](https://github.com/flatiron/wilkins/commit/50163a0) Fix #84 [Enable a better unhandled exception experience](https://github.com/flatiron/wilkins/issues/84) (`samz`)
  * [8b5fbcd](https://github.com/flatiron/wilkins/commit/8b5fbcd) #448 Added tailable option to file transport which rolls files backwards instead of creating incrementing appends. Implements #268 (`neouser99`)
  * [a34f7d2](https://github.com/flatiron/wilkins/commit/a34f7d2) Custom log formatter functionality were added. (`Melnyk Andii`)
  * [4c08191](https://github.com/flatiron/wilkins/commit/4c08191) Added showLevel flag to common.js, file*, memory and console transports. (`Tony Germaneri`)
  * [64ed8e0](https://github.com/flatiron/wilkins/commit/64ed8e0) Adding custom pretty print function test. (`Alberto Pose`)
  * [3872dfb](https://github.com/flatiron/wilkins/commit/3872dfb) Adding prettyPrint parameter as function example. (`Alberto Pose`)
  * [2b96eee](https://github.com/flatiron/wilkins/commit/2b96eee) implemented filters #526 (`Chris Oloff`)
  * [72273b1](https://github.com/flatiron/wilkins/commit/72273b1) Added the options to colorize only the level, only the message or all. Default behavior is kept. Using true will only colorize the level and false will not colorize anything. (`Michiel De Mey`)
  * [178e8a6](https://github.com/flatiron/wilkins/commit/178e8a6) Prevent message from meta input being overwritten (`Leonard Martin`)
  * [270be86](https://github.com/flatiron/wilkins/commit/270be86) [api] Allow for transports to be removed by their string name [test fix] Add test coverage for multiple transports of the same type added in #187. [doc] Document using multiple transports of the same type (`indexzero`)
  * [0a848fa](https://github.com/flatiron/wilkins/commit/0a848fa) Add depth options for meta pretty print (`Loïc Mahieu`)
  * [106b670](https://github.com/flatiron/wilkins/commit/106b670) Allow debug messages to be sent to stdout (`John Frizelle`)
  * [ad2d5e1](https://github.com/flatiron/wilkins/commit/ad2d5e1) [fix] Handle Error instances in a sane way since their properties are non-enumerable __by default.__ Fixes #280. (`indexzero`)
  * [5109dd0](https://github.com/flatiron/wilkins/commit/5109dd0) [fix] Have a default `until` before a default `from`. Fixes #478. (`indexzero`)
  * [d761960](https://github.com/flatiron/wilkins/commit/d761960) Fix logging regular expression objects (`Chasen Le Hara`)
  * [2632eb8](https://github.com/flatiron/wilkins/commit/2632eb8) Add option for EOL chars on FileTransport (`José F. Romaniello`)
  * [bdecce7](https://github.com/flatiron/wilkins/commit/bdecce7) Remove duplicate logstash option (`José F. Romaniello`)
  * [7a01f9a](https://github.com/flatiron/wilkins/commit/7a01f9a) Update declaration block according to project's style guide (`Ricardo Torres`)
  * [ae27a19](https://github.com/flatiron/wilkins/commit/ae27a19) Fixes #306: Can't set customlevels to my loggers (RangeError: Maximum call stack size exceeded) (`Alberto Pose`)
  * [1ba4f51](https://github.com/flatiron/wilkins/commit/1ba4f51) [fix] Call `res.resume()` in HttpTransport to get around known issues in streams2. (`indexzero`)
  * [39e0258](https://github.com/flatiron/wilkins/commit/39e0258) Updated default option handling for CLI (`Jacob Thomason`)
  * [8252801](https://github.com/flatiron/wilkins/commit/8252801) Added logstash support to console transport (`Ramon Snir`)
  * [18aa301](https://github.com/flatiron/wilkins/commit/18aa301) Module isStream should be isstream (`Michael Neil`)
  * [2f5f296](https://github.com/flatiron/wilkins/commit/2f5f296) options.prettyPrint can now be a function (`Matt Zukowski`)
  * [a87a876](https://github.com/flatiron/wilkins/commit/a87a876) Adding rotationFormat prop to file.js (`orcaman`)
  * [ff187f4](https://github.com/flatiron/wilkins/commit/ff187f4) Allow custom exception level (`jupiter`)

## 0.8.3 / 2014-11-04

* [fix lowercase issue (`jcrugzz`)](https://github.com/flatiron/wilkins/commit/b3ffaa10b5fe9d2a510af5348cf4fb3870534123)

## 0.8.2 / 2014-11-04

* [Full fix for #296 with proper streams2 detection with `isstream` for file transport (`jcrugzz`)](https://github.com/flatiron/wilkins/commit/5c4bd4191468570e46805ed399cad63cfb1856cc)
* [Add isstream module (`jcrugzz`)](https://github.com/flatiron/wilkins/commit/498b216d0199aebaef72ee4d8659a00fb737b9ae)
* [Partially fix #296 with streams2 detection for file transport (`indexzero`)](https://github.com/flatiron/wilkins/commit/b0227b6c27cf651ffa8b8192ef79ab24296362e3)
* [add stress test for issue #288 (`indexzero`)](https://github.com/flatiron/wilkins/commit/e08e504b5b3a00f0acaade75c5ba69e6439c84a6)
* [lessen timeouts to check test sanity (`indexzero`)](https://github.com/flatiron/wilkins/commit/e925f5bc398a88464f3e796545ff88912aff7568)
* [update wilkins-graylog2 documentation (`unlucio`)](https://github.com/flatiron/wilkins/commit/49fa86c31baf12c8ac3adced3bdba6deeea2e363)
* [fix test formatting (`indexzero`)](https://github.com/flatiron/wilkins/commit/8e2225799520a4598044cdf93006d216812a27f9)
* [fix so options are not redefined (`indexzero`)](https://github.com/flatiron/wilkins/commit/d1d146e8a5bb73dcb01579ad433f6d4f70b668ea)
* [fix self/this issue that broke `http` transport (`indexzero`)](https://github.com/flatiron/wilkins/commit/d10cbc07755c853b60729ab0cd14aa665da2a63b)


## 0.8.1 / 2014-10-06

* [Add label option for DailyRotateFile transport (`francoisTemasys`)](https://github.com/flatiron/wilkins/pull/459)
* [fix Logger#transports length check upon Logger#log (`adriano-di-giovanni`, `indexzero`)](https://github.com/flatiron/wilkins/pull/404)
* [err can be a string. (`gdw2`, `indexzero`)](https://github.com/flatiron/wilkins/pull/396)
* [Added color for pre-defined cli set. (`danilo1105`, `indexzero`)](https://github.com/flatiron/wilkins/pull/365)
* [Fix dates on transport test (`revington`)](https://github.com/flatiron/wilkins/pull/346)
* [Included the label from options to the output in JSON mode. (`arxony`)](https://github.com/flatiron/wilkins/pull/326)
* [Allow using logstash option with the File transport (`gmajoulet`)](https://github.com/flatiron/wilkins/pull/299)
* [Be more defensive when working with `query` methods from Transports. Fixes #356. (indexzero)](https://github.com/flatiron/wilkins/commit/b80638974057f74b521dbe6f43fef2105110afa2)
* [Catch exceptions for file transport unlinkSync (`calvinfo`)](https://github.com/flatiron/wilkins/pull/266)
* [Adding the 'addRewriter' to wilkins (`machadogj`)](https://github.com/flatiron/wilkins/pull/258)
* [Updates to transport documentation (`pose`)](https://github.com/flatiron/wilkins/pull/262)
* [fix typo in "Extending another object with Logging" section.](https://github.com/flatiron/wilkins/pull/281)
* [Updated README.md - Replaced properties with those listed in wilkins-mongodb module](https://github.com/flatiron/wilkins/pull/264)

## 0.8.0 / 2014-09-15
  * [Fixes for HTTP Transport](https://github.com/flatiron/wilkins/commit/a876a012641f8eba1a976eada15b6687d4a03f82)
  * Removing [jsonquest](https://github.com/flatiron/wilkins/commit/4f088382aeda28012b7a0498829ceb243ed74ac1) and [request](https://github.com/flatiron/wilkins/commit/a5676313b4e9744802cc3b8e1468e4af48830876) dependencies.
  * Configuration is now [shalow cloned](https://github.com/flatiron/wilkins/commit/08fccc81d18536d33050496102d98bde648853f2).
  * [Added logstash support](https://github.com/flatiron/wilkins/pull/445/files)
  * Fix for ["flush" event should always fire after "flush" call bug](https://github.com/flatiron/wilkins/pull/446/files)
  * Added tests for file: [open and stress](https://github.com/flatiron/wilkins/commit/47d885797a2dd0d3cd879305ca813a0bd951c378).
  * [Test fixes](https://github.com/flatiron/wilkins/commit/9e39150e0018f43d198ca4c160acef2af9860bf4)
  * [Fix ")" on string interpolation](https://github.com/flatiron/wilkins/pull/394/files)

## 0.6.2 / 2012-07-08

  * Added prettyPrint option for console logging
  * Multi-line values for conditional returns are not allowed
  * Added acceptance of `stringify` option
  * Fixed padding for log levels

