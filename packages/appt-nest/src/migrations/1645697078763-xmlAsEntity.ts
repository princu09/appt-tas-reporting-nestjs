import { MigrationInterface, QueryRunner } from 'typeorm';

export class xmlAsEntity1645697078763 implements MigrationInterface {
  name = 'xmlAsEntity1645697078763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "KnightsAdmin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "CaseWorkerName" character varying, "MatterReference" integer, "EntityReference" character varying, "MatterNumber" integer, "NumberOfBorrwers" integer, CONSTRAINT "PK_e25e5013d1d3985577ca3c0c176" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsBorrowerDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "Borrower1Title" character varying, "Borrower1Forname" character varying, "Borrower1Surname" character varying, "Borrower1Email" character varying, "Borrower2Title" character varying, "Borrower2Forname" character varying, "Borrower2Surname" character varying, "Borrower2Email" character varying, "Borrower3Title" character varying, "Borrower3Forname" character varying, "Borrower3Surname" character varying, "Borrower3Email" character varying, "Borrower4Title" character varying, "Borrower4Forname" character varying, "Borrower4Surname" character varying, "Borrower4Email" character varying, CONSTRAINT "PK_bc393161401a4c9d43e6aec5c4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsBorrowerDetailsQuestionaire" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "Borrower1Name" character varying, "Borrower1Salutation" character varying, "Borrower1MobileTelNo" character varying, "Borrower1HomeTelNo" character varying, "Borrower1EveningTelNo" character varying, "Borrower1Email" character varying, "Borrower1DOB" character varying, "Borrower1DrivingLicenceNo" character varying, "Borrower1PassportNo" character varying, "Borrower2Name" character varying, "Borrower2Salutation" character varying, "Borrower2MobileTelNo" character varying, "Borrower2HomeTelNo" character varying, "Borrower2EveningTelNo" character varying, "Borrower2Email" character varying, "Borrower2DOB" character varying, "Borrower2DrivingLicenceNo" character varying, "Borrower2PassportNo" character varying, "SignatureBorrower1" character varying, "SignatureBorrower2" character varying, CONSTRAINT "PK_4b2d04f476db91b70b971d5722e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsPropertyDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "RemortgageAddressLine1" character varying, "RemortgageAddressLine2" character varying, "RemortgageAddressLine3" character varying, "RemortgageAddressLine4" character varying, "RemortgageAddressPostcode" character varying, CONSTRAINT "PK_0dac73e434e8aa8146664a0d314" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsPropertyDetailsQuestionaire" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "RemortgageHouseNo" character varying, "RemortgageAddressStreet" character varying, "RemortgageAddressTown" character varying, "RemortgageAddressArea" character varying, "RemortgageAddressPostcode" character varying, "UnencumberedStatus" character varying, "Tenure" character varying, "PropertyTitleNumber" character varying, "SharedOwnershipStatus" character varying, CONSTRAINT "PK_109f56c7ef4301a82015e6c6da2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsSolitor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "SolicitorName" character varying, "SolicitorAddressLine1" character varying, "SolicitorAddressLine2" character varying, "SolicitorAddressPostcode" character varying, CONSTRAINT "PK_b52270c9b065bc8a8cccc25903c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsAdditionalInfoDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "AdditionalInfo" character varying, CONSTRAINT "PK_dc6641b404a0783bd15b9dcdc54" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsAdditionalLandDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "AdditionalLandStatus" character varying, "AdditionalLandAdditionalTitles" character varying, "AdditionalLandAdditionalTitleNumbers" character varying, CONSTRAINT "PK_e1130c40273f22d44b9839510ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsBrokerDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "BrokerEmail" character varying, "BrokerName" character varying, CONSTRAINT "PK_658b5b22d3ec32b398b48c52878" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsBuildingsInsuranceDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "BuildingsInsurerName" character varying, "BuildingsInsurancePolicyNumber" character varying, "BuildingsInsuranceCoverAmount" character varying, "BuildingsInsuranceExpiryDate" character varying, CONSTRAINT "PK_632dcee4d98f052d8cc10f100e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsKeyDatesDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "AwayFromDate" character varying, "BackFromDate" character varying, "PreferredCompletionDate" character varying, "PreferredCompletionDateTbc" character varying, "CompleteAsap" character varying, CONSTRAINT "PK_1f4ff4833545c72b8f1cc6227f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsLeaseholdDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "FreeholderDetails" character varying, "ConfirmationGroundRentPaid" character varying, "ConfirmationNoGroundRentDisputes" character varying, "GroundRentReceiptsProvided" character varying, CONSTRAINT "PK_4b479fae99da79d7ee007b94ba6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsLenderDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "Lender1Name" character varying, "Lender1AccountNumber" character varying, "Lender1Type" character varying, "Lender1RepaymentStatus" character varying, "Lender1ErcStatus" character varying, "Lender1ErcDate" character varying, "Lender1ErcInstructions" character varying, "Lender1PaymentDate" character varying, "Lender2Name" character varying, "Lender2AccountNumber" character varying, "Lender2Type" character varying, "Lender2RepaymentStatus" character varying, "Lender2ErcStatus" character varying, "Lender2ErcDate" character varying, "Lender2ErcInstructions" character varying, "Lender2PaymentDate" character varying, "Lender3Name" character varying, "Lender3AccountNumber" character varying, "Lender3Type" character varying, "Lender3RepaymentStatus" character varying, "Lender3ErcStatus" character varying, "Lender3ErcDate" character varying, "Lender3ErcInstructions" character varying, "Lender3PaymentDate" character varying, "Lender4Name" character varying, "Lender4AccountNumber" character varying, "Lender4Type" character varying, "Lender4RepaymentStatus" character varying, "Lender4ErcStatus" character varying, "Lender4ErcDate" character varying, "Lender4ErcInstructions" character varying, "Lender4PaymentDate" character varying, CONSTRAINT "PK_38ffb3a1e3938b5ab4fcafd2eaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsMatterAdminDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "MatterReference" character varying, "EntityReference" character varying, "MatterNumber" character varying, CONSTRAINT "PK_c916d8bd854e64439f7f1621632" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsMortgageDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "SantanderBufferInstructions" character varying, "BarclaysToleranceInstructions" character varying, "TidInstructions" character varying, "DmdInstructions" character varying, "McdInstructions" character varying, CONSTRAINT "PK_da4d7a5fbe0c4dc00f3f0f599a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsOccupierDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "OccupierStatus" character varying, "OccupierNames" character varying, CONSTRAINT "PK_da33d81993b15923871521346ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "KnightsSurplusShortfallDetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "SurplusOrShortfallExpected" character varying, "SurplusOrShortfall" character varying, "SurplusOrShortfallAmount" character varying, "SurplusMethod" character varying, "BorrowerBankName" character varying, "BorrowerBankAccountNumber" character varying, "BorrowerSortCode" character varying, "BorrowerBankAccountName" character varying, "SoleAccount" character varying, CONSTRAINT "PK_05995558603e644fb4ddcc1c837" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "mortgage" DROP COLUMN "Solitor"`);
    await queryRunner.query(`ALTER TABLE "mortgage" DROP COLUMN "Admin"`);
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP COLUMN "PropertyDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP COLUMN "BorrowerDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "MatterAdminDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "BorrowerDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "PropertyDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "BrokerDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "KeyDatesDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "LeaseholdDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "SurplusShortfallDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "AdditionalLandDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "LenderDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "MortgageDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "BuildingsInsuranceDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "OccupierDetails"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "AdditionalInfoDetails"`,
    );
    await queryRunner.query(`ALTER TABLE "mortgage" ADD "solitorId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "UQ_72627b52398fd4dca417ca7efe1" UNIQUE ("solitorId")`,
    );
    await queryRunner.query(`ALTER TABLE "mortgage" ADD "adminId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "UQ_9e1d6f393cee76684602300aabb" UNIQUE ("adminId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD "propertyDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "UQ_02a19f319d95c5f9a4b8f1ec7d7" UNIQUE ("propertyDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD "borrowerDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "UQ_7664b3ca421f114165e023ee024" UNIQUE ("borrowerDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "matterAdminDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_f01c2d33c2f8bde4695cc14d7a8" UNIQUE ("matterAdminDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "borrowerDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_de08dcd85b2717347ba2d292d33" UNIQUE ("borrowerDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "propertyDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_749f60ae8c154842db567d0b0bb" UNIQUE ("propertyDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "brokerDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_e4ac24281352f4363be71da64a2" UNIQUE ("brokerDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "keyDatesDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_de2aa762c5a1b86d61a6b048e7d" UNIQUE ("keyDatesDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "leaseholdDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_dd144a5acd8e1701d9ca5e92bc1" UNIQUE ("leaseholdDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "surplusShortfallDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_59c5426b85bf268e9b62d030115" UNIQUE ("surplusShortfallDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "additionalLandDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_a41c15a1cb17442ce263a12432f" UNIQUE ("additionalLandDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "lenderDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_d81c3dec32d2a81a09633955896" UNIQUE ("lenderDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "mortgageDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_4ba1963e0c92df114a1f11be10a" UNIQUE ("mortgageDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "buildingsInsuranceDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_c4fffd634e362b9b85d3ddaef4e" UNIQUE ("buildingsInsuranceDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "occupierDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_d0565f2ad0d10ed8327d2e8663d" UNIQUE ("occupierDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "additionalInfoDetailsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "UQ_fdf5f2e28682092c349413236f3" UNIQUE ("additionalInfoDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_72627b52398fd4dca417ca7efe1" FOREIGN KEY ("solitorId") REFERENCES "KnightsSolitor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_9e1d6f393cee76684602300aabb" FOREIGN KEY ("adminId") REFERENCES "KnightsAdmin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_02a19f319d95c5f9a4b8f1ec7d7" FOREIGN KEY ("propertyDetailsId") REFERENCES "KnightsPropertyDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_7664b3ca421f114165e023ee024" FOREIGN KEY ("borrowerDetailsId") REFERENCES "KnightsBorrowerDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_f01c2d33c2f8bde4695cc14d7a8" FOREIGN KEY ("matterAdminDetailsId") REFERENCES "KnightsMatterAdminDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_de08dcd85b2717347ba2d292d33" FOREIGN KEY ("borrowerDetailsId") REFERENCES "KnightsBorrowerDetailsQuestionaire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_749f60ae8c154842db567d0b0bb" FOREIGN KEY ("propertyDetailsId") REFERENCES "KnightsPropertyDetailsQuestionaire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_e4ac24281352f4363be71da64a2" FOREIGN KEY ("brokerDetailsId") REFERENCES "KnightsBrokerDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_de2aa762c5a1b86d61a6b048e7d" FOREIGN KEY ("keyDatesDetailsId") REFERENCES "KnightsKeyDatesDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_dd144a5acd8e1701d9ca5e92bc1" FOREIGN KEY ("leaseholdDetailsId") REFERENCES "KnightsLeaseholdDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_59c5426b85bf268e9b62d030115" FOREIGN KEY ("surplusShortfallDetailsId") REFERENCES "KnightsSurplusShortfallDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_a41c15a1cb17442ce263a12432f" FOREIGN KEY ("additionalLandDetailsId") REFERENCES "KnightsAdditionalLandDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_d81c3dec32d2a81a09633955896" FOREIGN KEY ("lenderDetailsId") REFERENCES "KnightsLenderDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_4ba1963e0c92df114a1f11be10a" FOREIGN KEY ("mortgageDetailsId") REFERENCES "KnightsMortgageDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_c4fffd634e362b9b85d3ddaef4e" FOREIGN KEY ("buildingsInsuranceDetailsId") REFERENCES "KnightsBuildingsInsuranceDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_d0565f2ad0d10ed8327d2e8663d" FOREIGN KEY ("occupierDetailsId") REFERENCES "KnightsOccupierDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_fdf5f2e28682092c349413236f3" FOREIGN KEY ("additionalInfoDetailsId") REFERENCES "KnightsAdditionalInfoDetails"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_fdf5f2e28682092c349413236f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_d0565f2ad0d10ed8327d2e8663d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_c4fffd634e362b9b85d3ddaef4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_4ba1963e0c92df114a1f11be10a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_d81c3dec32d2a81a09633955896"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_a41c15a1cb17442ce263a12432f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_59c5426b85bf268e9b62d030115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_dd144a5acd8e1701d9ca5e92bc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_de2aa762c5a1b86d61a6b048e7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_e4ac24281352f4363be71da64a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_749f60ae8c154842db567d0b0bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_de08dcd85b2717347ba2d292d33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_f01c2d33c2f8bde4695cc14d7a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_7664b3ca421f114165e023ee024"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_02a19f319d95c5f9a4b8f1ec7d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_9e1d6f393cee76684602300aabb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_72627b52398fd4dca417ca7efe1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_fdf5f2e28682092c349413236f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "additionalInfoDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_d0565f2ad0d10ed8327d2e8663d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "occupierDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_c4fffd634e362b9b85d3ddaef4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "buildingsInsuranceDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_4ba1963e0c92df114a1f11be10a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "mortgageDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_d81c3dec32d2a81a09633955896"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "lenderDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_a41c15a1cb17442ce263a12432f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "additionalLandDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_59c5426b85bf268e9b62d030115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "surplusShortfallDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_dd144a5acd8e1701d9ca5e92bc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "leaseholdDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_de2aa762c5a1b86d61a6b048e7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "keyDatesDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_e4ac24281352f4363be71da64a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "brokerDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_749f60ae8c154842db567d0b0bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "propertyDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_de08dcd85b2717347ba2d292d33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "borrowerDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "UQ_f01c2d33c2f8bde4695cc14d7a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "matterAdminDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "UQ_7664b3ca421f114165e023ee024"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP COLUMN "borrowerDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "UQ_02a19f319d95c5f9a4b8f1ec7d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP COLUMN "propertyDetailsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "UQ_9e1d6f393cee76684602300aabb"`,
    );
    await queryRunner.query(`ALTER TABLE "mortgage" DROP COLUMN "adminId"`);
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "UQ_72627b52398fd4dca417ca7efe1"`,
    );
    await queryRunner.query(`ALTER TABLE "mortgage" DROP COLUMN "solitorId"`);
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "AdditionalInfoDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "OccupierDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "BuildingsInsuranceDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "MortgageDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "LenderDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "AdditionalLandDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "SurplusShortfallDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "LeaseholdDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "KeyDatesDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "BrokerDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "PropertyDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "BorrowerDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "MatterAdminDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD "BorrowerDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD "PropertyDetails" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD "Admin" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD "Solitor" jsonb NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "KnightsSurplusShortfallDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsOccupierDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsMortgageDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsMatterAdminDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsLenderDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsLeaseholdDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsKeyDatesDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsBuildingsInsuranceDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsBrokerDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsAdditionalLandDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsAdditionalInfoDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsSolitor"`);
    await queryRunner.query(`DROP TABLE "KnightsPropertyDetailsQuestionaire"`);
    await queryRunner.query(`DROP TABLE "KnightsPropertyDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsBorrowerDetailsQuestionaire"`);
    await queryRunner.query(`DROP TABLE "KnightsBorrowerDetails"`);
    await queryRunner.query(`DROP TABLE "KnightsAdmin"`);
  }
}
