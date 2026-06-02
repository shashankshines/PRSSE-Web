#!/bin/bash

# Array of scientists with their public domain image URLs from Wikimedia Commons
declare -A scientists=(
    ["galileo"]="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Galileo.arp.300pix.jpg/640px-Galileo.arp.300pix.jpg"
    ["newton"]="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/GodfreyKneller-IsaacNewton-1689.jpg/640px-GodfreyKneller-IsaacNewton-1689.jpg"
    ["darwin"]="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Charles_Darwin_photograph_circa_1869.jpg/640px-Charles_Darwin_photograph_circa_1869.jpg"
    ["pasteur"]="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Louis_Pasteur%2C_foto_av_Paul_Nadar.jpg/640px-Louis_Pasteur%2C_foto_av_Paul_Nadar.jpg"
    ["maxwell"]="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/James_Clerk_Maxwell.png/640px-James_Clerk_Maxwell.png"
    ["tesla"]="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/640px-N.Tesla.JPG"
    ["curie"]="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_1911.jpg/640px-Marie_Curie_1911.jpg"
    ["einstein"]="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/640px-Albert_Einstein_Head.jpg"
    ["feynman"]="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Richard_Feynman_Nobel.jpg/640px-Richard_Feynman_Nobel.jpg"
    ["hawking"]="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/640px-Stephen_Hawking.StarChild.jpg"
)

echo "Downloading scientist images..."

for scientist in "${!scientists[@]}"; do
    url="${scientists[$scientist]}"
    filename="${scientist}.webp"
    
    echo "Downloading $scientist..."
    
    # Download as temporary file
    temp_file="/tmp/${scientist}_temp.jpg"
    curl -s -L "$url" -o "$temp_file"
    
    # Convert to webp using ImageMagick if available
    if command -v convert &> /dev/null; then
        convert "$temp_file" -quality 85 -resize 1000x1000 "$filename"
        echo "✓ Saved $filename (converted to webp)"
    else
        # If ImageMagick not available, use cwebp if available
        if command -v cwebp &> /dev/null; then
            cwebp -quality 85 "$temp_file" -o "$filename"
            echo "✓ Saved $filename (converted to webp)"
        else
            # Fallback: keep as jpg
            mv "$temp_file" "${scientist}.jpg"
            echo "✓ Saved ${scientist}.jpg (no webp conversion available)"
        fi
    fi
    
    rm -f "$temp_file"
    sleep 1
done

echo "Done!"
