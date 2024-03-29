Gem::Specification.new do |spec|
  spec.name          = "OnChip"
  spec.version       = "2.0.10"
  spec.authors       = ["OnChip"]
  spec.email         = ["chengrui_zhou@163.com"]

  spec.summary       = "Just another documentation theme compatible with GitHub Pages"
  spec.license       = "MIT"
  spec.homepage      = "https://github.com/ChengruiZhou/"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "github-pages", "~> 209"
end
