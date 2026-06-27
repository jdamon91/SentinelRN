package com.sentinelrn.nativemodule

import android.os.Build
import android.os.Debug
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import java.io.File

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
      promise.resolve(map)
    } catch (e: Exception) {
      promise.reject("integrity_error", "Failed to collect integrity snapshot", e)
    }
  }

  // ── Root detection ─────────────────────────────────────────────────────────
  private fun isRooted(): Boolean =
    hasSuBinary() || hasRootPackages() || hasTestKeys() || hasWritableSystemPaths()

  private fun hasSuBinary(): Boolean = SU_PATHS.any { safe { File(it).exists() } }

  private fun hasRootPackages(): Boolean {
    val pm = reactApplicationContext.packageManager
    return ROOT_PACKAGES.any { pkg ->
      safe {
        @Suppress("DEPRECATION")
        pm.getPackageInfo(pkg, 0)
        true
      }
    }
  }

  private fun hasTestKeys(): Boolean =
    Build.TAGS?.contains("test-keys") == true

  private fun hasWritableSystemPaths(): Boolean =
    WRITABLE_PATHS.any { safe { File(it).canWrite() } }

  // ── Emulator detection ─────────────────────────────────────────────────────
  private fun isEmulator(): Boolean {
    val fp = Build.FINGERPRINT ?: ""
    val model = Build.MODEL ?: ""
    val brand = Build.BRAND ?: ""
    val device = Build.DEVICE ?: ""
    val product = Build.PRODUCT ?: ""
    val hardware = Build.HARDWARE ?: ""
    return fp.startsWith("generic") ||
      fp.contains("vbox") ||
      fp.contains("emulator") ||
      model.contains("google_sdk") ||
      model.contains("Emulator") ||
      model.contains("Android SDK built for") ||
      brand.startsWith("generic") && device.startsWith("generic") ||
      product.contains("sdk") ||
      hardware.contains("goldfish") ||
      hardware.contains("ranchu")
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
  private fun isHookingDetected(): Boolean = hasFridaArtifacts() || hasXposedArtifacts()

  private fun hasFridaArtifacts(): Boolean = safe {
    File("/proc/self/maps").readLines().any { line ->
      line.contains("frida") || line.contains("gum-js-loop") || line.contains("gmain")
    }
  } ?: false

  private fun hasXposedArtifacts(): Boolean = safe {
    File("/proc/self/maps").readLines().any { it.contains("XposedBridge") }
  } ?: false

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
      "/system/app/Superuser.apk",
      "/system/bin/.ext/.su",
      "/data/local/xbin/su",
      "/data/local/bin/su",
      "/su/bin/su",
    )

    private val ROOT_PACKAGES = listOf(
      "com.topjohnwu.magisk",
      "eu.chainfire.supersu",
      "com.koushikdutta.superuser",
      "com.noshufou.android.su",
      "com.thirdparty.superuser",
    )

    private val WRITABLE_PATHS = listOf("/system", "/system/bin", "/system/sbin", "/vendor/bin")
  }
}
