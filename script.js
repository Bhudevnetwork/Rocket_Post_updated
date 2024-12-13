let pdfDoc = null;
let watermarkedPdfBytes = null;
let mergePdfDoc = null;

// Load the uploaded PDF
async function loadPdf(file) {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
        const pdfBytes = new Uint8Array(fileReader.result);
        pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    };
    fileReader.readAsArrayBuffer(file);
}

document.getElementById("pdf-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        loadPdf(file);
    } else {
        alert("Please select a valid PDF file.");
    }
});

// Add watermark to the uploaded PDF
async function addWatermark() {
    if (!pdfDoc) {
        alert("Please upload a PDF first.");
        return;
    }

    const watermarkType = document.getElementById("watermark-select").value;
    const pages = pdfDoc.getPages();

    let watermarkText, color;

    if (watermarkType === "Bhudev") {
        watermarkText = "BhudevNetworkVivah.com";
        color = [0.8, 0.2, 0.3]; // Dark pink
    } else if (watermarkType === "NRI") {
        watermarkText = "NRI.BhudevNetworkVivah.com";
        color = [0.5, 0, 0.5]; // Dark purple
    } else if (watermarkType === "Divorce") {
        watermarkText = "Divorce.BhudevNetworkVivah.com";
        color = [0.8, 0, 0]; // Dark red
    } else if (watermarkType === "Saurashtra") {
        watermarkText = "Saurashtra.BhudevNetworkVivah.com";
        color = [0.612, 0.153, 0.690]; // Dark purple
    } else if (watermarkType === "Doctor") {
        watermarkText = "Doctor.BhudevNetworkVivah.com";
        color = [0.012, 0.663, 0.957]; // Dark Blue
    } else if (watermarkType === "Masters") {
        watermarkText = "Masters.BhudevNetworkVivah.com";
        color = [0.914, 0.118, 0.388]; // Dark red
    } else if (watermarkType === "CACS") {
        watermarkText = "CACS.BhudevNetworkVivah.com";
        color = [1.0, 0.478, 0.098]; // Dark red
    } else if (watermarkType === "Maharashtra") {
        watermarkText = "Maharashtra.BhudevNetworkVivah.com";
        color = [0.914, 0.118, 0.388]; // Dark red
    } else if (watermarkType === "Govjob") {
        watermarkText = "GovJob.BhudevNetworkVivah.com";
        color = [0.612, 0.153, 0.690]; // Dark red
    } else if (watermarkType === "40plus") {
        watermarkText = "40plus.BhudevNetworkVivah.com";
        color = [0.902, 0.180, 0.016]; // Dark red
    } else if (watermarkType === "1012") {
        watermarkText = "1012.BhudevNetworkVivah.com";
        color = [0.612, 0.141, 0.690]; // Dark red
    } else if (watermarkType === "SG") {
        watermarkText = "SG.BhudevNetworkVivah.com";
        color = [0.106, 0.737, 0.612]; // Dark red
    } else if (watermarkType === "NG") {
        watermarkText = "NG.BhudevNetworkVivah.com";
        color = [0.612, 0.141, 0.690]; // Dark red
    }

    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    // Loop through all pages and add watermark
    pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, 14);
        const textHeight = font.heightAtSize(14);

        // Add watermark at top-right
        page.drawText(watermarkText, {
            x: width - textWidth - 10,
            y: height - textHeight - 10,
            size: 14,
            color: PDFLib.rgb(...color),
            opacity: 0.90,
            font: font
        });

        // Add watermark at center
        page.drawText(watermarkText, {
            x: (width - textWidth) / 2,
            y: (height - textHeight) / 2,
            size: 20,
            color: PDFLib.rgb(...color),
            opacity: 0.45,
            rotate: PDFLib.degrees(45),
        });
    });

    watermarkedPdfBytes = await pdfDoc.save();
    const blob = new Blob([watermarkedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const mergeButton = document.getElementById("merge-btn");
    mergeButton.style.display = "inline-block";
}

// Load the default PDF to merge
document.getElementById("merge-pdf-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            const pdfBytes = new Uint8Array(fileReader.result);
            mergePdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        };
        fileReader.readAsArrayBuffer(file);
    } else {
        alert("Please select a valid PDF file to merge.");
    }
});

// Merge watermarked PDF with default PDF
async function mergePdfs() {
    if (!mergePdfDoc || !watermarkedPdfBytes) {
        alert("Please upload both PDFs to merge.");
        return;
    }

    const watermarkedPdf = await PDFLib.PDFDocument.load(watermarkedPdfBytes);
    const finalPdfDoc = await PDFLib.PDFDocument.create();

    // Copy pages from watermarked PDF
    const watermarkedPages = await finalPdfDoc.copyPages(
        watermarkedPdf,
        watermarkedPdf.getPageIndices()
    );
    watermarkedPages.forEach((page) => finalPdfDoc.addPage(page));

    // Copy pages from the default PDF
    const mergePages = await finalPdfDoc.copyPages(
        mergePdfDoc,
        mergePdfDoc.getPageIndices()
    );
    mergePages.forEach((page) => finalPdfDoc.addPage(page));

    const finalPdfBytes = await finalPdfDoc.save();
    const blob = new Blob([finalPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const finalDownloadButton = document.getElementById("final-download-btn");
    finalDownloadButton.style.display = "inline-block";
    finalDownloadButton.onclick = function () {
        const cityName = document.getElementById("city-name").value;
        const nameSurname = document.getElementById("name-surname").value;
        const birthDate = document.getElementById("birth-date").value;
        const education = document.getElementById("education").value;

        const customFilename = `(${cityName}).${nameSurname}.(${birthDate}).${education}.PDF`;


        const a = document.createElement("a");
        a.href = url;
        a.download = customFilename || "final_merged.pdf";
        a.click();
    };
}
