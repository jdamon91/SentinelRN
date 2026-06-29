require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "SentinelRNNative"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.license      = package["license"]
  s.author       = { "SentinelRN" => "https://github.com/jdamon91/SentinelRN" }
  s.homepage     = "https://github.com/jdamon91/SentinelRN"
  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/jdamon91/SentinelRN.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.swift_version = "5.0"

  s.dependency "React-Core"
end
