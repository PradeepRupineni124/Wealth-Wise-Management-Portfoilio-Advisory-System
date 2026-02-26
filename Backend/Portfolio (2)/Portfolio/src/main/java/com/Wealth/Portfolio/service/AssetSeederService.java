package com.Wealth.Portfolio.service;

import com.Wealth.Portfolio.model.Asset;
import com.Wealth.Portfolio.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AssetSeederService implements CommandLineRunner {

    private final AssetRepository assetRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only run if the table is completely empty!
        if (assetRepository.count() == 0) {
            log.info("ASSET table is empty. Fetching data directly from Excel (.xlsx) file...");
            seedAssetsFromExcel();
        } else {
            log.info("ASSET table already contains data. Skipping Excel upload.");
        }
    }

    private void seedAssetsFromExcel() {
        try (InputStream is = getClass().getResourceAsStream("/Asset_Updated.xlsx");
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            List<Asset> assetsToSave = new ArrayList<>();
            boolean isFirstRow = true;

            for (Row row : sheet) {
                if (isFirstRow) {
                    isFirstRow = false; // Skip the header row
                    continue;
                }

                // Stop if we hit an empty row
                if (row.getCell(0) == null || row.getCell(0).getStringCellValue().trim().isEmpty()) {
                    break;
                }

                Asset asset = Asset.builder()
                        .symbol(row.getCell(0).getStringCellValue().trim())
                        .assetName(row.getCell(1).getStringCellValue().trim())
                        .assetType(row.getCell(2).getStringCellValue().trim())
                        .sector(row.getCell(3).getStringCellValue().trim())
                        .currency(row.getCell(4).getStringCellValue().trim())
                        .currentPrice(BigDecimal.valueOf(row.getCell(5).getNumericCellValue()))
                        .geography(row.getCell(6).getStringCellValue().trim())
                        .lastUpdated(LocalDateTime.now())
                        .build();

                assetsToSave.add(asset);
            }

            assetRepository.saveAll(assetsToSave);
            log.info("Successfully fetched and saved {} assets from Excel.", assetsToSave.size());

        } catch (Exception e) {
            log.error("Failed to fetch assets from Excel. Ensure 'assets.xlsx' is exactly named that in the resources folder.", e);
        }
    }
}