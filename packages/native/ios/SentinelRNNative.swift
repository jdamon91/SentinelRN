import Foundation
import MachO

/**
 SentinelRN iOS runtime-integrity detectors.

 Produces a flat "integrity snapshot" that the JS layer maps into scored threat
 signals. Every check is heuristic and best-effort — see the SentinelRN threat
 model. Detection never throws into the host app; an undetectable condition is
 reported as `false`.
 */
@objc(SentinelRNNative)
class SentinelRNNative: NSObject {

  @objc(getIntegritySnapshot:rejecter:)
  func getIntegritySnapshot(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let snapshot: [String: Any] = [
      "platform": "ios",
      "isJailbroken": isJailbroken(),
      "isSimulator": isSimulator(),
      "isDebuggerAttached": isDebuggerAttached(),
      "isHookingDetected": isHookingDetected(),
    ]
    resolve(snapshot)
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  // MARK: - Jailbreak detection

  private func isJailbroken() -> Bool {
    if isSimulator() { return false }
    return hasJailbreakPaths()
      || canWriteOutsideSandbox()
      || hasSuspiciousSymlinks()
      || canOpenJailbreakScheme()
  }

  private func hasJailbreakPaths() -> Bool {
    let fm = FileManager.default
    for path in Self.jailbreakPaths where fm.fileExists(atPath: path) {
      return true
    }
    return false
  }

  private func canWriteOutsideSandbox() -> Bool {
    let probe = "/private/sentinelrn_jb_probe.txt"
    do {
      try "probe".write(toFile: probe, atomically: true, encoding: .utf8)
      try? FileManager.default.removeItem(atPath: probe)
      return true
    } catch {
      return false
    }
  }

  private func hasSuspiciousSymlinks() -> Bool {
    let fm = FileManager.default
    for path in ["/Applications", "/var/stash", "/usr/libexec"] {
      if let attrs = try? fm.attributesOfItem(atPath: path),
        let type = attrs[.type] as? FileAttributeType,
        type == .typeSymbolicLink {
        return true
      }
    }
    return false
  }

  private func canOpenJailbreakScheme() -> Bool {
    let schemes = ["cydia://package/com.example.package", "sileo://", "zbra://"]
    var result = false
    let check = {
      for scheme in schemes {
        if let url = URL(string: scheme), self.openURLCheck(url) {
          result = true
          break
        }
      }
    }
    if Thread.isMainThread { check() } else { DispatchQueue.main.sync(execute: check) }
    return result
  }

  private func openURLCheck(_ url: URL) -> Bool {
    #if canImport(UIKit)
    guard let app = UIApplicationShared() else { return false }
    let sel = NSSelectorFromString("canOpenURL:")
    guard app.responds(to: sel) else { return false }
    return app.perform(sel, with: url) != nil
    #else
    return false
    #endif
  }

  private func UIApplicationShared() -> NSObject? {
    let cls: AnyClass? = NSClassFromString("UIApplication")
    let sel = NSSelectorFromString("sharedApplication")
    guard let cls = cls, cls.responds(to: sel) else { return nil }
    return (cls as AnyObject).perform(sel)?.takeUnretainedValue() as? NSObject
  }

  // MARK: - Simulator detection

  private func isSimulator() -> Bool {
    #if targetEnvironment(simulator)
    return true
    #else
    return false
    #endif
  }

  // MARK: - Debugger detection

  private func isDebuggerAttached() -> Bool {
    var info = kinfo_proc()
    var size = MemoryLayout<kinfo_proc>.stride
    var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
    let result = sysctl(&mib, UInt32(mib.count), &info, &size, nil, 0)
    if result != 0 { return false }
    return (info.kp_proc.p_flag & P_TRACED) != 0
  }

  // MARK: - Hooking / instrumentation detection

  private func isHookingDetected() -> Bool {
    return hasInjectedLibraries() || hasSuspiciousDyldImages()
  }

  private func hasInjectedLibraries() -> Bool {
    if let env = getenv("DYLD_INSERT_LIBRARIES") {
      return String(cString: env).isEmpty == false
    }
    return false
  }

  private func hasSuspiciousDyldImages() -> Bool {
    let suspicious = ["substrate", "substitute", "frida", "cycript", "libhooker", "tweak"]
    let count = _dyld_image_count()
    for i in 0..<count {
      if let namePtr = _dyld_get_image_name(i) {
        let name = String(cString: namePtr).lowercased()
        if suspicious.contains(where: { name.contains($0) }) {
          return true
        }
      }
    }
    return false
  }

  private static let jailbreakPaths = [
    "/Applications/Cydia.app",
    "/Applications/Sileo.app",
    "/Applications/Zebra.app",
    "/Applications/Filza.app",
    "/Applications/blackra1n.app",
    "/Applications/FakeCarrier.app",
    "/Library/MobileSubstrate/MobileSubstrate.dylib",
    "/Library/MobileSubstrate/DynamicLibraries",
    "/usr/sbin/sshd",
    "/usr/bin/ssh",
    "/usr/libexec/ssh-keysign",
    "/bin/bash",
    "/bin/sh",
    "/etc/apt",
    "/etc/ssh/sshd_config",
    "/private/var/lib/apt",
    "/private/var/lib/apt/",
    "/private/var/lib/cydia",
    "/private/var/tmp/cydia.log",
    "/private/var/jb",
    "/var/jb",
  ]
}
