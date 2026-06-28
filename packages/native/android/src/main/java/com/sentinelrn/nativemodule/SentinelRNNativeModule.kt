package com.sentinelrn.nativemodule

import android.content.pm.ApplicationInfo
import android.os.Build
import android.os.Debug
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

/**
 * SentinelRN Android runtime-integrity detectors.
 *
 * Produces a flat boolean "integrity snapshot" that the JS layer maps into
 * scored threat signals. Every check is heuristic and best-effort — see the
 * SentinelRN threat model. Detection failures are swallowed so the module never
 * crashes the host app; a missing answer is reported as "not detected".
 */
class SentinelRNNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun getIntegritySnapshot(promise: Promise) {
    try {
      val map: WritableMap = Arguments.createMap()
      map.putString("platform", "android")
      map.putBoolean("isRooted", isRooted())
      map.putBoolean("isEmulator", isEmulator())
      map.putBoolean("isDebuggerAttached", isDebuggerAttached())
      map.putBoolean("isDeveloperModeEnabled", isDeveloperModeEnabled())
      map.putBoolean("isMockLocationEnabled", isMockLocationEnabled())
      map.putBoolean("isHookingDetected", isHookingDetected())
      map.putBoolean("isTamperingDetected", isTamperingDetected())
      promise.resolve(map)
    } catch (e: Exception) {
      promise.reject("integrity_error", "Failed to collect integrity snapshot", e)
    }
  }

  // ── Root detection ─────────────────────────────────────────────────────────
  private fun isRooted(): Boolean =
    hasSuBinary() ||
      canExecuteSu() ||
      hasRootPackages() ||
      hasRootCloakingPackages() ||
      hasBusybox() ||
      hasTestKeys() ||
      hasWritableSystemPaths() ||
      isDebuggableBuildProp()

  private fun hasSuBinary(): Boolean = SU_PATHS.any { safe { File(it).exists() } == true }

  private fun canExecuteSu(): Boolean = safe {
    val process = Runtime.getRuntime().exec(arrayOf("which", "su"))
    val reader = BufferedReader(InputStreamReader(process.inputStream))
    val line = reader.readLine()
    process.destroy()
    !line.isNullOrBlank()
  } ?: false

  private fun hasRootPackages(): Boolean = anyPackageInstalled(ROOT_PACKAGES)

  private fun hasRootCloakingPackages(): Boolean = anyPackageInstalled(CLOAKING_PACKAGES)

  private fun hasBusybox(): Boolean = BUSYBOX_PATHS.any { safe { File(it).exists() } == true }

  private fun anyPackageInstalled(packages: List<String>): Boolean {
    val pm = reactApplicationContext.packageManager
    return packages.any { pkg ->
      safe {
        @Suppress("DEPRECATION")
        pm.getPackageInfo(pkg, 0)
        true
      } ?: false
    }
  }

  private fun hasTestKeys(): Boolean = Build.TAGS?.contains("test-keys") == true

  private fun hasWritableSystemPaths(): Boolean =
    WRITABLE_PATHS.any { safe { File(it).canWrite() } == true }

  private fun isDebuggableBuildProp(): Boolean = safe {
    getSystemProperty("ro.debuggable") == "1" || getSystemProperty("ro.secure") == "0"
  } ?: false

  // ── Emulator detection ─────────────────────────────────────────────────────
  private fun isEmulator(): Boolean {
    val fp = Build.FINGERPRINT ?: ""
    val model = Build.MODEL ?: ""
    val brand = Build.BRAND ?: ""
    val device = Build.DEVICE ?: ""
    val product = Build.PRODUCT ?: ""
    val hardware = Build.HARDWARE ?: ""
    val manufacturer = Build.MANUFACTURER ?: ""
    return fp.startsWith("generic") ||
      fp.contains("vbox") ||
      fp.contains("emulator") ||
      fp.contains("test-keys") && fp.contains("sdk") ||
      model.contains("google_sdk") ||
      model.contains("Emulator") ||
      model.contains("Android SDK built for") ||
      (brand.startsWith("generic") && device.startsWith("generic")) ||
      product.contains("sdk") ||
      product.contains("vbox") ||
      hardware.contains("goldfish") ||
      hardware.contains("ranchu") ||
      manufacturer.contains("Genymotion") ||
      manufacturer.contains("unknown")
  }

  // ── Debugger ───────────────────────────────────────────────────────────────
  private fun isDebuggerAttached(): Boolean =
    Debug.isDebuggerConnected() || Debug.waitingForDebugger()

  // ── Developer mode ─────────────────────────────────────────────────────────
  private fun isDeveloperModeEnabled(): Boolean = safe {
    Settings.Global.getInt(
      reactApplicationContext.contentResolver,
      Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
      0,
    ) != 0
  } ?: false

  // ── Mock location ──────────────────────────────────────────────────────────
  private fun isMockLocationEnabled(): Boolean = safe {
    @Suppress("DEPRECATION")
    Settings.Secure.getString(
      reactApplicationContext.contentResolver,
      Settings.Secure.ALLOW_MOCK_LOCATION,
    ) == "1"
  } ?: false

  // ── Hooking / instrumentation ──────────────────────────────────────────────
  private fun isHookingDetected(): Boolean =
    hasFridaArtifacts() || hasXposedArtifacts() || hasSubstrateArtifacts() || hasFridaPort()

  private fun mapsContains(vararg needles: String): Boolean = safe {
    File("/proc/self/maps").readLines().any { line -> needles.any { line.contains(it) } }
  } ?: false

  private fun hasFridaArtifacts(): Boolean =
    mapsContains("frida", "gum-js-loop", "gmain", "linjector")

  private fun hasXposedArtifacts(): Boolean = mapsContains("XposedBridge", "app_process_xposed")

  private fun hasSubstrateArtifacts(): Boolean = mapsContains("substrate", "cydia")

  private fun hasFridaPort(): Boolean = safe {
    File("/proc/net/tcp").readLines().any { it.contains(":59A8") } // 27042 in hex
  } ?: false

  // ── Tampering ──────────────────────────────────────────────────────────────
  private fun isTamperingDetected(): Boolean = isAppDebuggable() || isSideloaded()

  private fun isAppDebuggable(): Boolean = safe {
    (reactApplicationContext.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
  } ?: false

  private fun isSideloaded(): Boolean = safe {
    val pm = reactApplicationContext.packageManager
    val installer =
      @Suppress("DEPRECATION") pm.getInstallerPackageName(reactApplicationContext.packageName)
    installer != null && installer !in TRUSTED_INSTALLERS
  } ?: false

  // ── Helpers ────────────────────────────────────────────────────────────────
  private fun getSystemProperty(key: String): String? = safe {
    val process = Runtime.getRuntime().exec(arrayOf("getprop", key))
    val reader = BufferedReader(InputStreamReader(process.inputStream))
    val value = reader.readLine()
    process.destroy()
    value
  }

  private fun <T> safe(block: () -> T): T? = try {
    block()
  } catch (_: Throwable) {
    null
  }

  companion object {
    const val NAME = "SentinelRNNative"

    private val SU_PATHS = listOf(
      "/system/bin/su",
      "/system/xbin/su",
      "/sbin/su",
      "/su/bin/su",
      "/system/app/Superuser.apk",
      "/system/bin/.ext/.su",
      "/system/usr/we-need-root/su-backup",
      "/data/local/xbin/su",
      "/data/local/bin/su",
      "/data/local/su",
      "/cache/su",
      "/dev/su",
    )

    private val BUSYBOX_PATHS = listOf(
      "/system/bin/busybox",
      "/system/xbin/busybox",
      "/sbin/busybox",
      "/data/local/busybox",
    )

    private val ROOT_PACKAGES = listOf(
      "com.topjohnwu.magisk",
      "eu.chainfire.supersu",
      "com.koushikdutta.superuser",
      "com.noshufou.android.su",
      "com.noshufou.android.su.elite",
      "com.thirdparty.superuser",
      "com.yellowes.su",
      "me.weishu.kernelsu",
    )

    private val CLOAKING_PACKAGES = listOf(
      "com.devadvance.rootcloak",
      "com.devadvance.rootcloakplus",
      "de.robv.android.xposed.installer",
      "com.saurik.substrate",
      "com.formyhm.hideroot",
    )

    private val WRITABLE_PATHS =
      listOf("/system", "/system/bin", "/system/sbin", "/vendor/bin", "/sbin", "/etc")

    private val TRUSTED_INSTALLERS = setOf(
      "com.android.vending", // Google Play
      "com.google.android.feedback",
      "com.amazon.venezia", // Amazon Appstore
      "com.sec.android.app.samsungapps", // Galaxy Store
    )
  }
}
