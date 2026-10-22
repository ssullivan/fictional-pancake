/* The number format that Grade 6 Unit 8's game (Data Detectives) and its Learn pages use. The statistics and their pictures
   (meanOf, dotPlot, boxPlot, histogram, …) are in shared/stats.js, which uses fmt from here.

   fmt(n)                                   a number as written: commas, up to 2 decimal places */

/* a number as written: commas and up to 2 decimal places */
const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });
