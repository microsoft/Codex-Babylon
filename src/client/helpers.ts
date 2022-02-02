// Set of helpers for generated code to use

// Get the asset URL for the given asset name
export async function getAssetUrls(asset) {
    const response = await fetch(
        `http://localhost:1018/assetUrls?text=${asset}`
    );
    const data = await response.json();
    // Each part group in the data (data.partGroup) contains a TextParts array where the fourth element is the asset URL. Return all assetUrls

    return data.PartGroups.map(
        (part) => part && part.TextParts && part.TextParts[3]
    );
}
