// Set of helpers for generated code to use

// Get the asset URL for the given asset name
export async function getAssetUrls(asset) {
    const response = await fetch(
        `http://localhost:1018/assetUrls?text=${asset}`
    );
    const data = await response.json();
    return data.PartGroups.filter(
        partGroup => partGroup.TextParts && partGroup.TextParts[3] && partGroup.TextParts[3].Text
    ).map(partGroup => partGroup.TextParts[3].Text);
}
