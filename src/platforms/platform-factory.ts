import {PlatformOptions} from './platform-options';
import {BasePlatform} from './base-platform';
import {NpmPlatform} from './multi-package-downloading-platforms/npm-platform';
import {DefaultPlatform} from './default-platform';
import {GoPlatform} from './multi-package-downloading-platforms/go-platform';
import {PackagistPlatform} from './multi-package-downloading-platforms/packagist-platform';
import {PyPiPlatform} from './multi-package-downloading-platforms/py-pi-platform';
import {RubyGemsPlatform} from './multi-package-downloading-platforms/ruby-gems-platform';
import {BowerPlatform} from './multi-package-downloading-platforms/bower-platform';
import {CargoPlatform} from './multi-package-downloading-platforms/cargo-platform';
import {HackagePlatform} from './multi-package-downloading-platforms/hackage-platform';
import {MeteorPlatform} from './multi-package-downloading-platforms/meteor-platform';
import {AtomPlatform} from './multi-package-downloading-platforms/atom-platform';
import {HomebrewPlatform} from './multi-package-downloading-platforms/homebrew-platform';
import {SublimePlatform} from './multi-package-downloading-platforms/sublime-platform';
import {DubPlatform} from './multi-package-downloading-platforms/dub-platform';
import {NimblePlatform} from './multi-package-downloading-platforms/nimble-platform';
import {AlcatrazPlatform} from './multi-package-downloading-platforms/alcatraz-platform';
import {JuliaPlatform} from './multi-package-downloading-platforms/julia-platform';
import {CranPlatform} from './multi-package-downloading-platforms/cran-platform';
import {NuGetPlatform} from './single-package-download-platforms/nu-get-platform';
import {PureScriptPlatform} from './single-package-download-platforms/pure-script-platform';
import {InqludePlatform} from './single-package-download-platforms/inqlude-platform';
import {RacketPlatform} from './single-package-download-platforms/racket-platform';
import {ElmPlatform} from './single-package-download-platforms/elm-platform';
import {HaxelibPlatform} from './single-package-download-platforms/haxelib-platform';
import {PlatformIOPlatform} from './single-package-download-platforms/platform-io-platform';
import {CocoaPodsPlatform} from './single-package-download-platforms/cocoa-pods-platform';
import {MavenPlatform} from './unsupported-platforns/maven-platform';
import {WordPressPlatform} from './unsupported-platforns/word-press-platform';
import {CpanPlatform} from './unsupported-platforns/cpan-platform';
import {ClojarsPlatform} from './unsupported-platforns/clojars-platform';
import {HexPlatform} from './unsupported-platforns/hex-platform';
import {PubPlatform} from './unsupported-platforns/pub-platform';
import {PuppetPlatform} from './unsupported-platforns/puppet-platform';
import {EmacsPlatform} from './unsupported-platforns/emacs-platform';
import {SwiftPMPlatform} from './unsupported-platforns/swift-pm-platform';
import {CarthagePlatform} from './unsupported-platforns/carthage-platform';

/**
 * Instances for each platform
 *
 * In O(1) in getting the platform instance (instead of switch-case)
 */
const platformsInstancesLookup: { [platform in PlatformOptions]: BasePlatform } = {
  [PlatformOptions.NPM]: NpmPlatform.instance,
  [PlatformOptions.GO]: GoPlatform.instance,
  [PlatformOptions.PACKAGIST]: PackagistPlatform.instance,
  [PlatformOptions.PYPI]: PyPiPlatform.instance,
  [PlatformOptions.MAVEN]: MavenPlatform.instance,
  [PlatformOptions.NUGET]: NuGetPlatform.instance,
  [PlatformOptions.RUBYGEMS]: RubyGemsPlatform.instance,
  [PlatformOptions.BOWER]: BowerPlatform.instance,
  [PlatformOptions.WORD_PRESS]: WordPressPlatform.instance,
  [PlatformOptions.COCOA_PODS]: CocoaPodsPlatform.instance,
  [PlatformOptions.CPAN]: CpanPlatform.instance,
  [PlatformOptions.CARGO]: CargoPlatform.instance,
  [PlatformOptions.CLOJARS]: ClojarsPlatform.instance,
  [PlatformOptions.CRAN]: CranPlatform.instance,
  [PlatformOptions.HACKAGE]: HackagePlatform.instance,
  [PlatformOptions.METEOR]: MeteorPlatform.instance,
  [PlatformOptions.ATOM]: AtomPlatform.instance,
  [PlatformOptions.HEX]: HexPlatform.instance,
  [PlatformOptions.PUB]: PubPlatform.instance,
  [PlatformOptions.PLATFORM_IO]: PlatformIOPlatform.instance,
  [PlatformOptions.PUPPET]: PuppetPlatform.instance,
  [PlatformOptions.EMACS]: EmacsPlatform.instance,
  [PlatformOptions.HOMEBREW]: HomebrewPlatform.instance,
  [PlatformOptions.SWIFT_PM]: SwiftPMPlatform.instance,
  [PlatformOptions.CARTHAGE]: CarthagePlatform.instance,
  [PlatformOptions.JULIA]: JuliaPlatform.instance,
  [PlatformOptions.SUBLIME]: SublimePlatform.instance,
  [PlatformOptions.DUB]: DubPlatform.instance,
  [PlatformOptions.RACKET]: RacketPlatform.instance,
  [PlatformOptions.ELM]: ElmPlatform.instance,
  [PlatformOptions.HAXELIB]: HaxelibPlatform.instance,
  [PlatformOptions.NIMBLE]: NimblePlatform.instance,
  [PlatformOptions.ALCATRAZ]: AlcatrazPlatform.instance,
  [PlatformOptions.PURE_SCRIPT]: PureScriptPlatform.instance,
  [PlatformOptions.INQLUDE]: InqludePlatform.instance
};

export function platformFactory(platform: PlatformOptions): BasePlatform {
  return platformsInstancesLookup[platform] || DefaultPlatform.instance;
}
