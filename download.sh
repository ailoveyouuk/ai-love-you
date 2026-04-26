#!/bin/bash
urls=(
  "sardinia https://littlewanderbook.com/wp-content/uploads/2024/09/Wat-te-doen-in-Sardinie-16-van-22-scaled.jpg"
  "sevenpines https://lh3.googleusercontent.com/d/1lmxKbC8C99fWpiE-nVR4ox-gjevukdwO"
  "ducati https://mcn-images.bauersecure.com/wp-images/388530/1440x960/ducati-hypermotard-v2-11.jpg?mode=max&quality=90&scale=down"
  "ducati-front https://cdpcdn.dx1app.com/products/USA/DU/2026/MC/SUPERMOTO/HYPERMOTARD_V2_SP/50/SP_LIVERY/2000000004.jpg"
  "michelin https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2025/11/07/5f263e4b7a6844daa5043de074c5991d_logo-Bib-gourmand.jpg"
  "calong https://cdn.mos.cms.futurecdn.net/RRJeHVFittGcSSYRN65TcR.jpg"
  "kinyobi https://cdn.shopify.com/s/files/1/0941/2657/1867/files/Copy_of_Phill_Argent_-_10.9.1.HG_-_2026-03-05T161345.483.png?v=1772727516"
  "watches-and-wonders https://amz.luxewatches.co.uk/app/uploads/2026/01/02154824/watches-and-wonders-2026-april-14-april-20-geneva-02.webp"
  "moser https://watchbox-blog.imgix.net/wp-content/uploads/2026/04/Feature-HMoser_6103-2200_6103-2201_Streamliner_PUMP_Black_White__Lifestyle_Duo-scaled.jpg?auto=format,compress&w=2000&h=1050&fit=crop"
  "macbook-neo https://www.apple.com/mideast/macbook-neo/a/images/overview/product-stories/new-to-mac/ntm_hero_endframe__4u6qzi7yehe6_large.jpg"
  "plaud https://uae.plaud.ai/cdn/shop/files/notepin-s-official-kv.webp?v=1773324348&width=3840"
  "handycam https://retrospekt.com/cdn/shop/files/DV-VR-1040_2_606404a3-675d-4b96-9bde-cb3e3f068a78.jpg?v=1753286247&width=2048"
  "nhu-xuan https://www.galleriesnow.net/wp-content/uploads/2026/04/Autograph-Nhu-Xuan-Hua-4.webp"
  "torino https://www.initaly.it/_next/image?url=https%3A%2F%2Fstatics.initaly.it%2Fuploads%2Fimages%2Farticles%2Fexposed-torino-photo-festival-2026-mettersi-a-nudo-18-mostre-9494-1776176880836.jpeg&w=3840&q=75"
  "nat-faulkner https://d1pcposaq9vxjx.cloudfront.net/production/uploads/2025/09/Installation-view-of-Nat-Faulkner-Strong-water-at-Camden-Art-Centre-2026.-Photo-credit-Rob-Harris.-Low-res-33.jpg"
)

for item in "${urls[@]}"; do
  name=$(echo $item | awk '{print $1}')
  url=$(echo $item | awk '{print $2}')
  echo "Downloading $name..."
  curl -s -L "$url" -o "assets/journals/edition-08/${name}_raw"
  # convert using sips
  sips -s format webp "assets/journals/edition-08/${name}_raw" --out "assets/journals/edition-08/${name}.webp" > /dev/null 2>&1
  if [ ! -f "assets/journals/edition-08/${name}.webp" ]; then
    sips -s format jpeg "assets/journals/edition-08/${name}_raw" --out "assets/journals/edition-08/${name}.jpg" > /dev/null 2>&1
  fi
  rm "assets/journals/edition-08/${name}_raw"
done
