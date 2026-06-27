import Foundation

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
    ]
    resolve(snapshot)
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  // MARK: - Jailbreak detection

  private func isJailbroken() -> Bool {
    if isSimulator() { return false }
    return hasJailbreakPaths() || canWriteOutsideSandbox() || canOpenCydiaScheme()
  }

  private func hasJailbreakPaths() -> Bool {
    let paths = [
      "/Applications/Cydia.app",
      "/Applications/Sileo.app",
      "/Library/MobileSubstrate/MobileSubstrate.dylib",
      "/usr/sbin/sshd",
      "/usr/bin/ssh",
      "/bin/bash",
      "/etc/apt",
      "/private/var/lib/apt/",
      "/private/var/lib/cydia",
    ]
    let fm = FileManager.default
    for path in paths where fm.fileExists(atPath: path) {
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

  private func canOpenCydiaScheme() -> Bool {
    guard let url = URL(string: "cydia://package/com.example.package") else { return false }
    // UIApplication.canOpenURL must run on the main thread.
    var result = false
    if Thread.isMainThread {
      result = openURLCheck(url)
    } else {
      DispatchQueue.main.sync { result = openURLCheck(url) }
    }
    return result
  }

  private func openURLCheck(_ url: URL) -> Bool {
    #if canImport(UIKit)
    return UIApplicationShared()?.perform(NSSelectorFromString("canOpenURL:"), with: url) != nil
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
}
