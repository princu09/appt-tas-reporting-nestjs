--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE test_db;




--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:+L6Vjg5M4qSyX1RZ6dnLIg==$EBezWh93iOdKXDCVmtJEuFNqqr3HAgMKZ1FGiSb/d1U=:kwkPF9qugjc29H5Z0L9goEs67h4cD24pmDSCZhwM6Wo=';






--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4 (Debian 14.4-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4 (Debian 14.4-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- Database "test_db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4 (Debian 14.4-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: test_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE test_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE test_db OWNER TO postgres;

\connect test_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: notification_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_status_enum AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public.notification_status_enum OWNER TO postgres;

--
-- Name: notification_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type_enum AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public.notification_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: KnightsAdditionalInfoDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsAdditionalInfoDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "AdditionalInfo" character varying
);


ALTER TABLE public."KnightsAdditionalInfoDetails" OWNER TO postgres;

--
-- Name: KnightsAdditionalLandDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsAdditionalLandDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "AdditionalLandStatus" character varying,
    "AdditionalLandAdditionalTitles" character varying,
    "AdditionalLandAdditionalTitleNumbers" character varying
);


ALTER TABLE public."KnightsAdditionalLandDetails" OWNER TO postgres;

--
-- Name: KnightsAdmin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsAdmin" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "CaseWorkerName" character varying,
    "MatterReference" integer,
    "EntityReference" character varying,
    "MatterNumber" integer,
    "NumberOfBorrwers" integer
);


ALTER TABLE public."KnightsAdmin" OWNER TO postgres;

--
-- Name: KnightsBorrowerDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsBorrowerDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "Borrower1Title" character varying,
    "Borrower1Forname" character varying,
    "Borrower1Surname" character varying,
    "Borrower1Email" character varying,
    "Borrower2Title" character varying,
    "Borrower2Forname" character varying,
    "Borrower2Surname" character varying,
    "Borrower2Email" character varying,
    "Borrower3Title" character varying,
    "Borrower3Forname" character varying,
    "Borrower3Surname" character varying,
    "Borrower3Email" character varying,
    "Borrower4Title" character varying,
    "Borrower4Forname" character varying,
    "Borrower4Surname" character varying,
    "Borrower4Email" character varying
);


ALTER TABLE public."KnightsBorrowerDetails" OWNER TO postgres;

--
-- Name: KnightsBorrowerDetailsQuestionaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsBorrowerDetailsQuestionaire" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "Borrower1Name" character varying,
    "Borrower1Salutation" character varying,
    "Borrower1MobileTelNo" character varying,
    "Borrower1HomeTelNo" character varying,
    "Borrower1EveningTelNo" character varying,
    "Borrower1Email" character varying,
    "Borrower1DOB" character varying,
    "Borrower1DrivingLicenceNo" character varying,
    "Borrower1PassportNo" character varying,
    "Borrower2Name" character varying,
    "Borrower2Salutation" character varying,
    "Borrower2MobileTelNo" character varying,
    "Borrower2HomeTelNo" character varying,
    "Borrower2EveningTelNo" character varying,
    "Borrower2Email" character varying,
    "Borrower2DOB" character varying,
    "Borrower2DrivingLicenceNo" character varying,
    "Borrower2PassportNo" character varying,
    "SignatureBorrower1" character varying,
    "SignatureBorrower2" character varying
);


ALTER TABLE public."KnightsBorrowerDetailsQuestionaire" OWNER TO postgres;

--
-- Name: KnightsBrokerDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsBrokerDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "BrokerEmail" character varying,
    "BrokerName" character varying
);


ALTER TABLE public."KnightsBrokerDetails" OWNER TO postgres;

--
-- Name: KnightsBuildingsInsuranceDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsBuildingsInsuranceDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "BuildingsInsurerName" character varying,
    "BuildingsInsurancePolicyNumber" character varying,
    "BuildingsInsuranceCoverAmount" character varying,
    "BuildingsInsuranceExpiryDate" character varying
);


ALTER TABLE public."KnightsBuildingsInsuranceDetails" OWNER TO postgres;

--
-- Name: KnightsKeyDatesDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsKeyDatesDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "AwayFromDate" character varying,
    "BackFromDate" character varying,
    "PreferredCompletionDate" character varying,
    "PreferredCompletionDateTbc" character varying,
    "CompleteAsap" character varying
);


ALTER TABLE public."KnightsKeyDatesDetails" OWNER TO postgres;

--
-- Name: KnightsLeaseholdDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsLeaseholdDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "FreeholderDetails" character varying,
    "ConfirmationGroundRentPaid" character varying,
    "ConfirmationNoGroundRentDisputes" character varying,
    "GroundRentReceiptsProvided" character varying
);


ALTER TABLE public."KnightsLeaseholdDetails" OWNER TO postgres;

--
-- Name: KnightsLenderDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsLenderDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "Lender1Name" character varying,
    "Lender1AccountNumber" character varying,
    "Lender1Type" character varying,
    "Lender1RepaymentStatus" character varying,
    "Lender1ErcStatus" character varying,
    "Lender1ErcDate" character varying,
    "Lender1ErcInstructions" character varying,
    "Lender1PaymentDate" character varying,
    "Lender2Name" character varying,
    "Lender2AccountNumber" character varying,
    "Lender2Type" character varying,
    "Lender2RepaymentStatus" character varying,
    "Lender2ErcStatus" character varying,
    "Lender2ErcDate" character varying,
    "Lender2ErcInstructions" character varying,
    "Lender2PaymentDate" character varying,
    "Lender3Name" character varying,
    "Lender3AccountNumber" character varying,
    "Lender3Type" character varying,
    "Lender3RepaymentStatus" character varying,
    "Lender3ErcStatus" character varying,
    "Lender3ErcDate" character varying,
    "Lender3ErcInstructions" character varying,
    "Lender3PaymentDate" character varying,
    "Lender4Name" character varying,
    "Lender4AccountNumber" character varying,
    "Lender4Type" character varying,
    "Lender4RepaymentStatus" character varying,
    "Lender4ErcStatus" character varying,
    "Lender4ErcDate" character varying,
    "Lender4ErcInstructions" character varying,
    "Lender4PaymentDate" character varying
);


ALTER TABLE public."KnightsLenderDetails" OWNER TO postgres;

--
-- Name: KnightsMatterAdminDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsMatterAdminDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "MatterReference" character varying,
    "EntityReference" character varying,
    "MatterNumber" character varying
);


ALTER TABLE public."KnightsMatterAdminDetails" OWNER TO postgres;

--
-- Name: KnightsMortgageDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsMortgageDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "SantanderBufferInstructions" character varying,
    "BarclaysToleranceInstructions" character varying,
    "TidInstructions" character varying,
    "DmdInstructions" character varying,
    "McdInstructions" character varying
);


ALTER TABLE public."KnightsMortgageDetails" OWNER TO postgres;

--
-- Name: KnightsOccupierDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsOccupierDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "OccupierStatus" character varying,
    "OccupierNames" character varying
);


ALTER TABLE public."KnightsOccupierDetails" OWNER TO postgres;

--
-- Name: KnightsPropertyDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsPropertyDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "RemortgageAddressLine1" character varying,
    "RemortgageAddressLine2" character varying,
    "RemortgageAddressLine3" character varying,
    "RemortgageAddressLine4" character varying,
    "RemortgageAddressPostcode" character varying
);


ALTER TABLE public."KnightsPropertyDetails" OWNER TO postgres;

--
-- Name: KnightsPropertyDetailsQuestionaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsPropertyDetailsQuestionaire" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "RemortgageHouseNo" character varying,
    "RemortgageAddressStreet" character varying,
    "RemortgageAddressTown" character varying,
    "RemortgageAddressArea" character varying,
    "RemortgageAddressPostcode" character varying,
    "UnencumberedStatus" character varying,
    "Tenure" character varying,
    "PropertyTitleNumber" character varying,
    "SharedOwnershipStatus" character varying
);


ALTER TABLE public."KnightsPropertyDetailsQuestionaire" OWNER TO postgres;

--
-- Name: KnightsSolitor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsSolitor" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "SolicitorName" character varying,
    "SolicitorAddressLine1" character varying,
    "SolicitorAddressLine2" character varying,
    "SolicitorAddressPostcode" character varying
);


ALTER TABLE public."KnightsSolitor" OWNER TO postgres;

--
-- Name: KnightsSurplusShortfallDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."KnightsSurplusShortfallDetails" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "SurplusOrShortfallExpected" character varying,
    "SurplusOrShortfall" character varying,
    "SurplusOrShortfallAmount" character varying,
    "SurplusMethod" character varying,
    "BorrowerBankName" character varying,
    "BorrowerBankAccountNumber" character varying,
    "BorrowerSortCode" character varying,
    "BorrowerBankAccountName" character varying,
    "SoleAccount" character varying
);


ALTER TABLE public."KnightsSurplusShortfallDetails" OWNER TO postgres;

--
-- Name: MediaRestriction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaRestriction" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "mediaId" uuid NOT NULL,
    "subscriptionId" uuid,
    "roleId" uuid,
    "userDeniedId " uuid
);


ALTER TABLE public."MediaRestriction" OWNER TO postgres;

--
-- Name: OrganisationProduct; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrganisationProduct" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    description text,
    cost numeric(10,2) NOT NULL,
    active boolean DEFAULT false NOT NULL
);


ALTER TABLE public."OrganisationProduct" OWNER TO postgres;

--
-- Name: activatedborrower; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activatedborrower (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "borrowerId" uuid,
    "mortgageId" uuid
);


ALTER TABLE public.activatedborrower OWNER TO postgres;

--
-- Name: apitoken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.apitoken (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    token character varying(255),
    valid boolean NOT NULL,
    public boolean
);


ALTER TABLE public.apitoken OWNER TO postgres;

--
-- Name: apptledger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.apptledger (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    cost numeric(10,2) NOT NULL,
    outstanding boolean DEFAULT true NOT NULL,
    "stripeTransferID" text,
    "stripeIntentID" text,
    rolledover boolean DEFAULT false NOT NULL,
    "receivedAt" timestamp without time zone,
    organisation uuid NOT NULL
);


ALTER TABLE public.apptledger OWNER TO postgres;

--
-- Name: audittrail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audittrail (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    type character varying(25),
    key character varying(25),
    description character varying(255),
    subject uuid,
    restricted boolean,
    "additionalData" text
);


ALTER TABLE public.audittrail OWNER TO postgres;

--
-- Name: calendarevent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendarevent (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    name character varying(255),
    "locationURL" character varying(1024),
    "locationCoordinates" character varying(1024),
    "startTime" timestamp without time zone NOT NULL,
    duration character varying(255),
    cancelled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.calendarevent OWNER TO postgres;

--
-- Name: calendareventattendees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendareventattendees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "attendanceStatus" character varying(255),
    event uuid,
    attendee uuid
);


ALTER TABLE public.calendareventattendees OWNER TO postgres;

--
-- Name: chunkupload; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chunkupload (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "uploadId" character varying NOT NULL,
    "fileName" character varying NOT NULL,
    key character varying NOT NULL,
    "fileType" character varying NOT NULL,
    bucket character varying NOT NULL,
    "partsUploaded" jsonb DEFAULT '[]'::jsonb,
    "finishedRecordId" uuid
);


ALTER TABLE public.chunkupload OWNER TO postgres;

--
-- Name: email-template; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."email-template" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "fromAddress" text NOT NULL,
    subject text NOT NULL,
    "CC" text,
    "BCC" text,
    content text,
    triggers text[],
    "delayMinutes" integer,
    active boolean DEFAULT false NOT NULL,
    title text NOT NULL,
    "templateId" uuid NOT NULL
);


ALTER TABLE public."email-template" OWNER TO postgres;

--
-- Name: email-template-attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."email-template-attachments" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "recordId" uuid NOT NULL,
    "emailTemplateId" uuid NOT NULL
);


ALTER TABLE public."email-template-attachments" OWNER TO postgres;

--
-- Name: email-template-trigger-delayed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."email-template-trigger-delayed" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email jsonb NOT NULL,
    "timeToSend" timestamp without time zone NOT NULL,
    "templateId" uuid
);


ALTER TABLE public."email-template-trigger-delayed" OWNER TO postgres;

--
-- Name: formresponse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formresponse (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    questionkey character varying(255),
    questiontext character varying(255),
    response text,
    responsetype character varying(20),
    hasbeenderived boolean DEFAULT false NOT NULL,
    isderived boolean DEFAULT false NOT NULL,
    submission uuid
);


ALTER TABLE public.formresponse OWNER TO postgres;

--
-- Name: formsubmission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formsubmission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    type character varying(25),
    reference character varying(255),
    status character varying(10),
    subject uuid,
    "pdfUrl" character varying(255),
    uuid character varying(36),
    processed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.formsubmission OWNER TO postgres;

--
-- Name: leaderboard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaderboard (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    score integer NOT NULL
);


ALTER TABLE public.leaderboard OWNER TO postgres;

--
-- Name: listing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listing (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "addressLine1" character varying,
    "addressLine2" character varying,
    "postCode" character varying,
    city character varying,
    cost_pppw money,
    "bedroomCount" integer,
    "briefDescription" character varying,
    "fullDescription" character varying,
    "agentContactNumber" character varying,
    "holdingFee" money,
    "isLive" boolean DEFAULT false NOT NULL,
    "billsIncluded" boolean DEFAULT false NOT NULL,
    reserved boolean DEFAULT false NOT NULL,
    "contractLength" integer,
    "availableFrom" timestamp without time zone,
    "keyFeatures" character varying,
    name character varying,
    "locationSummary" character varying,
    latitude integer,
    longitude integer,
    "floorplanURL" character varying,
    "videoURL" character varying,
    "epcURL" character varying,
    "listingMediaId" uuid
);


ALTER TABLE public.listing OWNER TO postgres;

--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "colorHex" character varying,
    color character varying,
    description character varying,
    "authorUrl" character varying,
    "authorImageUrl" character varying,
    "featuredImageUrl" character varying,
    sort integer DEFAULT 0,
    public boolean DEFAULT false NOT NULL,
    published boolean DEFAULT false NOT NULL,
    author character varying,
    title character varying,
    icon jsonb,
    "recordId" uuid,
    "parentId" uuid
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: media_closure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media_closure (
    id_ancestor uuid NOT NULL,
    id_descendant uuid NOT NULL
);


ALTER TABLE public.media_closure OWNER TO postgres;

--
-- Name: messagingchatters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messagingchatters (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    active boolean DEFAULT false NOT NULL,
    conversation uuid NOT NULL
);


ALTER TABLE public.messagingchatters OWNER TO postgres;

--
-- Name: messagingconversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messagingconversation (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    name character varying(1024)
);


ALTER TABLE public.messagingconversation OWNER TO postgres;

--
-- Name: messagingconversation_chatters_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messagingconversation_chatters_user (
    "messagingconversationId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.messagingconversation_chatters_user OWNER TO postgres;

--
-- Name: messagingmessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messagingmessage (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    message text,
    conversation uuid NOT NULL
);


ALTER TABLE public.messagingmessage OWNER TO postgres;

--
-- Name: metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metadata (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "objId" integer,
    key character varying(1024),
    value character varying(1024),
    type character varying(1024)
);


ALTER TABLE public.metadata OWNER TO postgres;

--
-- Name: milestones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.milestones (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid,
    organisation uuid,
    site uuid,
    milestones jsonb NOT NULL
);


ALTER TABLE public.milestones OWNER TO postgres;

--
-- Name: mortgage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mortgage (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid,
    organisation uuid,
    site uuid,
    "Reference" text NOT NULL,
    "milestonesId" uuid,
    "solitorId" uuid,
    "adminId" uuid,
    "propertyDetailsId" uuid,
    "borrowerDetailsId" uuid
);


ALTER TABLE public.mortgage OWNER TO postgres;

--
-- Name: mortgage_borrowers_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mortgage_borrowers_user (
    "mortgageId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.mortgage_borrowers_user OWNER TO postgres;

--
-- Name: nest_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nest_migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.nest_migrations OWNER TO postgres;

--
-- Name: nest_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nest_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nest_migrations_id_seq OWNER TO postgres;

--
-- Name: nest_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nest_migrations_id_seq OWNED BY public.nest_migrations.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    status public.notification_status_enum DEFAULT '0'::public.notification_status_enum NOT NULL,
    "targetUserId" uuid,
    subject text NOT NULL,
    body text NOT NULL,
    type public.notification_type_enum NOT NULL,
    "from" text NOT NULL,
    "templateId" uuid NOT NULL,
    data jsonb
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_permission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    subject character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.notification_permission OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    status character varying(10),
    "intentId" character varying(255),
    "clientSecret" character varying(255),
    "fullStripeIntent" text,
    "paymentAmount" integer,
    subscription uuid NOT NULL
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: organisation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisation (
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255),
    deleted boolean,
    primarycolour character varying(255),
    secondarycolour character varying(255),
    logourl character varying(255),
    appsettings text,
    bundleid character varying(255),
    appuniversallink character varying(255),
    appstoreid character varying(255),
    androidpackageid character varying(255),
    appleappstorelink character varying(255),
    androidappstorelink character varying(255),
    enabledmodules text,
    "tertiaryColour" character varying(255),
    privacypolicy text,
    readmoretext text,
    public boolean DEFAULT false NOT NULL,
    "contentIsPublic" boolean DEFAULT false NOT NULL,
    "emailToSendNotifications" character varying(255),
    "sharedAppOwner" boolean DEFAULT false NOT NULL,
    "hasCustomApp" boolean DEFAULT false NOT NULL,
    "addressLineOne" character varying(150),
    "addressLineTwo" character varying(150),
    postcode character varying(10),
    city character varying(150),
    customdomain character varying(40),
    subscription integer,
    active boolean,
    admin uuid,
    hassites boolean DEFAULT false NOT NULL,
    numallowedusers integer DEFAULT 1000,
    notes text
);


ALTER TABLE public.organisation OWNER TO postgres;

--
-- Name: organisation_users_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisation_users_user (
    "organisationId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.organisation_users_user OWNER TO postgres;

--
-- Name: organisationcharge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisationcharge (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    cost numeric(10,2) NOT NULL,
    description text,
    processed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.organisationcharge OWNER TO postgres;

--
-- Name: organisationcontract; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisationcontract (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    cost numeric(10,2) NOT NULL
);


ALTER TABLE public.organisationcontract OWNER TO postgres;

--
-- Name: organisationemailtemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisationemailtemplate (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    html text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.organisationemailtemplate OWNER TO postgres;

--
-- Name: organisationsubscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisationsubscription (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    name character varying(255),
    "friendlyDescription" character varying(255),
    "statementDescription" character varying(20),
    "annualFee" integer,
    "numAllowedUsers" integer
);


ALTER TABLE public.organisationsubscription OWNER TO postgres;

--
-- Name: organisationsystemtag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisationsystemtag (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    type character varying(25),
    key character varying(25),
    value text,
    fieldtype character varying(20)
);


ALTER TABLE public.organisationsystemtag OWNER TO postgres;

--
-- Name: organisationtag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisationtag (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    type character varying(25),
    key character varying(25),
    value text,
    fieldtype character varying(20)
);


ALTER TABLE public.organisationtag OWNER TO postgres;

--
-- Name: organisationuserpurchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisationuserpurchases (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "productId" uuid NOT NULL,
    cost numeric(10,2) NOT NULL,
    processed boolean DEFAULT false NOT NULL,
    received boolean DEFAULT false NOT NULL
);


ALTER TABLE public.organisationuserpurchases OWNER TO postgres;

--
-- Name: questionaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questionaire (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid,
    organisation uuid,
    site uuid,
    "Errored" boolean DEFAULT false NOT NULL,
    "LastSent" timestamp without time zone,
    "matterAdminDetailsId" uuid,
    "borrowerDetailsId" uuid,
    "propertyDetailsId" uuid,
    "brokerDetailsId" uuid,
    "keyDatesDetailsId" uuid,
    "leaseholdDetailsId" uuid,
    "surplusShortfallDetailsId" uuid,
    "additionalLandDetailsId" uuid,
    "lenderDetailsId" uuid,
    "mortgageDetailsId" uuid,
    "buildingsInsuranceDetailsId" uuid,
    "occupierDetailsId" uuid,
    "additionalInfoDetailsId" uuid
);


ALTER TABLE public.questionaire OWNER TO postgres;

--
-- Name: record; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.record (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "fileName" character varying(2048) NOT NULL,
    "fileURL" character varying(2048) NOT NULL,
    "fileType" character varying(10) NOT NULL
);


ALTER TABLE public.record OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    title character varying(255),
    defaultrole boolean,
    hidden boolean,
    permissions text[] DEFAULT '{}'::text[] NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_users_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_users_user (
    "roleId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public.role_users_user OWNER TO postgres;

--
-- Name: roleuser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roleuser (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    role uuid NOT NULL
);


ALTER TABLE public.roleuser OWNER TO postgres;

--
-- Name: site; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255),
    notes text,
    address character varying(255),
    postcode character varying(255),
    city character varying(255),
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL
);


ALTER TABLE public.site OWNER TO postgres;

--
-- Name: siteadmin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siteadmin (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid
);


ALTER TABLE public.siteadmin OWNER TO postgres;

--
-- Name: siteuser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siteuser (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid
);


ALTER TABLE public.siteuser OWNER TO postgres;

--
-- Name: statapirequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statapirequest (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    endpoint character varying(255),
    "responseStatus" integer,
    method character varying(255),
    "currentOrganisation" character varying(255),
    "appVersionNumber" character varying(255),
    "appBuildNumber" character varying(255),
    "appBundleId" character varying(255),
    os character varying(255),
    "osVersion" character varying(255),
    "deviceModel" character varying(255)
);


ALTER TABLE public.statapirequest OWNER TO postgres;

--
-- Name: subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    title character varying(255),
    description text,
    "appleId" character varying(255),
    "googleId" character varying(255)
);


ALTER TABLE public.subscription OWNER TO postgres;

--
-- Name: subscriptionreceipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptionreceipt (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    subscription uuid NOT NULL,
    provider character varying(255),
    reference character varying(255)
);


ALTER TABLE public.subscriptionreceipt OWNER TO postgres;

--
-- Name: task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    name character varying(255),
    "additionalData" text,
    type character varying(255),
    status character varying(255),
    description text,
    "completedBy" timestamp without time zone,
    "notifyAt" integer
);


ALTER TABLE public.task OWNER TO postgres;

--
-- Name: testautoapi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.testautoapi (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text text NOT NULL,
    "someNumber" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid,
    organisation uuid,
    site uuid
);


ALTER TABLE public.testautoapi OWNER TO postgres;

--
-- Name: token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    token character varying(255),
    type character varying(255),
    "user" integer,
    expires timestamp without time zone
);


ALTER TABLE public.token OWNER TO postgres;

--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO postgres;

--
-- Name: uploadchunk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uploadchunk (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    filename character varying(255),
    uploadid character varying(255),
    index integer,
    totalchunks integer,
    etag character varying(255),
    filepath character varying(255)
);


ALTER TABLE public.uploadchunk OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(255),
    password character varying(255),
    email character varying(255),
    verifyemailtoken character varying(255),
    changepassword boolean,
    mobile character varying(255),
    firstname character varying(255),
    lastname character varying(255),
    devicetoken character varying(255),
    deleted boolean,
    apprated boolean,
    emailverified boolean,
    touchid character varying(255),
    backendcurrentorganisation integer,
    isdeveloper boolean DEFAULT false NOT NULL,
    enabledbcache boolean DEFAULT false NOT NULL,
    reference character varying(255),
    ethnicity character varying(255),
    gender character varying(255),
    "jobTitle" character varying(255),
    type character varying(255) DEFAULT 'user'::character varying,
    dob timestamp without time zone,
    "verificationExpires" timestamp without time zone,
    "verificationCode" integer,
    isglobaladmin boolean DEFAULT false NOT NULL,
    "addressLineOne" character varying(255),
    "addressLineTwo" character varying(255),
    city character varying(255),
    postcode character varying(255),
    actived boolean DEFAULT true NOT NULL,
    "passwordResetToken" uuid,
    "lastLoggedIn" timestamp with time zone,
    "stripeConnectAccountId" text,
    "selfSignUpProcessed" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_device_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_device_token (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "deviceToken" text NOT NULL
);


ALTER TABLE public.user_device_token OWNER TO postgres;

--
-- Name: user_notification_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notification_permission (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    "permissionId" uuid,
    "canSend" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.user_notification_permission OWNER TO postgres;

--
-- Name: userdirectaccess; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userdirectaccess (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    targetuser uuid NOT NULL,
    usergrantedaccess uuid NOT NULL
);


ALTER TABLE public.userdirectaccess OWNER TO postgres;

--
-- Name: usergroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usergroup (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    name character varying(255),
    description text,
    type character varying(55)
);


ALTER TABLE public.usergroup OWNER TO postgres;

--
-- Name: usergroupadmin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usergroupadmin (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    usergroup uuid NOT NULL
);


ALTER TABLE public.usergroupadmin OWNER TO postgres;

--
-- Name: usergroupmember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usergroupmember (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    usergroup uuid NOT NULL
);


ALTER TABLE public.usergroupmember OWNER TO postgres;

--
-- Name: usernotification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usernotification (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    read boolean,
    recipient uuid NOT NULL,
    title text,
    message text
);


ALTER TABLE public.usernotification OWNER TO postgres;

--
-- Name: usertag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usertag (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "deletedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL,
    organisation uuid NOT NULL,
    site uuid,
    type character varying(25),
    key character varying(25),
    value text,
    fieldtype character varying(20),
    sensitivity character varying(15)
);


ALTER TABLE public.usertag OWNER TO postgres;

--
-- Name: nest_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nest_migrations ALTER COLUMN id SET DEFAULT nextval('public.nest_migrations_id_seq'::regclass);


--
-- Data for Name: KnightsAdditionalInfoDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsAdditionalInfoDetails" (id, "AdditionalInfo") FROM stdin;
\.


--
-- Data for Name: KnightsAdditionalLandDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsAdditionalLandDetails" (id, "AdditionalLandStatus", "AdditionalLandAdditionalTitles", "AdditionalLandAdditionalTitleNumbers") FROM stdin;
\.


--
-- Data for Name: KnightsAdmin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsAdmin" (id, "CaseWorkerName", "MatterReference", "EntityReference", "MatterNumber", "NumberOfBorrwers") FROM stdin;
\.


--
-- Data for Name: KnightsBorrowerDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsBorrowerDetails" (id, "Borrower1Title", "Borrower1Forname", "Borrower1Surname", "Borrower1Email", "Borrower2Title", "Borrower2Forname", "Borrower2Surname", "Borrower2Email", "Borrower3Title", "Borrower3Forname", "Borrower3Surname", "Borrower3Email", "Borrower4Title", "Borrower4Forname", "Borrower4Surname", "Borrower4Email") FROM stdin;
\.


--
-- Data for Name: KnightsBorrowerDetailsQuestionaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsBorrowerDetailsQuestionaire" (id, "Borrower1Name", "Borrower1Salutation", "Borrower1MobileTelNo", "Borrower1HomeTelNo", "Borrower1EveningTelNo", "Borrower1Email", "Borrower1DOB", "Borrower1DrivingLicenceNo", "Borrower1PassportNo", "Borrower2Name", "Borrower2Salutation", "Borrower2MobileTelNo", "Borrower2HomeTelNo", "Borrower2EveningTelNo", "Borrower2Email", "Borrower2DOB", "Borrower2DrivingLicenceNo", "Borrower2PassportNo", "SignatureBorrower1", "SignatureBorrower2") FROM stdin;
\.


--
-- Data for Name: KnightsBrokerDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsBrokerDetails" (id, "BrokerEmail", "BrokerName") FROM stdin;
\.


--
-- Data for Name: KnightsBuildingsInsuranceDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsBuildingsInsuranceDetails" (id, "BuildingsInsurerName", "BuildingsInsurancePolicyNumber", "BuildingsInsuranceCoverAmount", "BuildingsInsuranceExpiryDate") FROM stdin;
\.


--
-- Data for Name: KnightsKeyDatesDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsKeyDatesDetails" (id, "AwayFromDate", "BackFromDate", "PreferredCompletionDate", "PreferredCompletionDateTbc", "CompleteAsap") FROM stdin;
\.


--
-- Data for Name: KnightsLeaseholdDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsLeaseholdDetails" (id, "FreeholderDetails", "ConfirmationGroundRentPaid", "ConfirmationNoGroundRentDisputes", "GroundRentReceiptsProvided") FROM stdin;
\.


--
-- Data for Name: KnightsLenderDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsLenderDetails" (id, "Lender1Name", "Lender1AccountNumber", "Lender1Type", "Lender1RepaymentStatus", "Lender1ErcStatus", "Lender1ErcDate", "Lender1ErcInstructions", "Lender1PaymentDate", "Lender2Name", "Lender2AccountNumber", "Lender2Type", "Lender2RepaymentStatus", "Lender2ErcStatus", "Lender2ErcDate", "Lender2ErcInstructions", "Lender2PaymentDate", "Lender3Name", "Lender3AccountNumber", "Lender3Type", "Lender3RepaymentStatus", "Lender3ErcStatus", "Lender3ErcDate", "Lender3ErcInstructions", "Lender3PaymentDate", "Lender4Name", "Lender4AccountNumber", "Lender4Type", "Lender4RepaymentStatus", "Lender4ErcStatus", "Lender4ErcDate", "Lender4ErcInstructions", "Lender4PaymentDate") FROM stdin;
\.


--
-- Data for Name: KnightsMatterAdminDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsMatterAdminDetails" (id, "MatterReference", "EntityReference", "MatterNumber") FROM stdin;
\.


--
-- Data for Name: KnightsMortgageDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsMortgageDetails" (id, "SantanderBufferInstructions", "BarclaysToleranceInstructions", "TidInstructions", "DmdInstructions", "McdInstructions") FROM stdin;
\.


--
-- Data for Name: KnightsOccupierDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsOccupierDetails" (id, "OccupierStatus", "OccupierNames") FROM stdin;
\.


--
-- Data for Name: KnightsPropertyDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsPropertyDetails" (id, "RemortgageAddressLine1", "RemortgageAddressLine2", "RemortgageAddressLine3", "RemortgageAddressLine4", "RemortgageAddressPostcode") FROM stdin;
\.


--
-- Data for Name: KnightsPropertyDetailsQuestionaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsPropertyDetailsQuestionaire" (id, "RemortgageHouseNo", "RemortgageAddressStreet", "RemortgageAddressTown", "RemortgageAddressArea", "RemortgageAddressPostcode", "UnencumberedStatus", "Tenure", "PropertyTitleNumber", "SharedOwnershipStatus") FROM stdin;
\.


--
-- Data for Name: KnightsSolitor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsSolitor" (id, "SolicitorName", "SolicitorAddressLine1", "SolicitorAddressLine2", "SolicitorAddressPostcode") FROM stdin;
\.


--
-- Data for Name: KnightsSurplusShortfallDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."KnightsSurplusShortfallDetails" (id, "SurplusOrShortfallExpected", "SurplusOrShortfall", "SurplusOrShortfallAmount", "SurplusMethod", "BorrowerBankName", "BorrowerBankAccountNumber", "BorrowerSortCode", "BorrowerBankAccountName", "SoleAccount") FROM stdin;
\.


--
-- Data for Name: MediaRestriction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaRestriction" (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "mediaId", "subscriptionId", "roleId", "userDeniedId ") FROM stdin;
\.


--
-- Data for Name: OrganisationProduct; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrganisationProduct" (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, description, cost, active) FROM stdin;
\.


--
-- Data for Name: activatedborrower; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activatedborrower (id, "createdAt", "borrowerId", "mortgageId") FROM stdin;
\.


--
-- Data for Name: apitoken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apitoken (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, token, valid, public) FROM stdin;
\.


--
-- Data for Name: apptledger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apptledger (id, "createdAt", "updatedAt", cost, outstanding, "stripeTransferID", "stripeIntentID", rolledover, "receivedAt", organisation) FROM stdin;
\.


--
-- Data for Name: audittrail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audittrail (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, type, key, description, subject, restricted, "additionalData") FROM stdin;
\.


--
-- Data for Name: calendarevent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendarevent (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, name, "locationURL", "locationCoordinates", "startTime", duration, cancelled) FROM stdin;
\.


--
-- Data for Name: calendareventattendees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendareventattendees (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "attendanceStatus", event, attendee) FROM stdin;
\.


--
-- Data for Name: chunkupload; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chunkupload (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "uploadId", "fileName", key, "fileType", bucket, "partsUploaded", "finishedRecordId") FROM stdin;
\.


--
-- Data for Name: email-template; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."email-template" (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "fromAddress", subject, "CC", "BCC", content, triggers, "delayMinutes", active, title, "templateId") FROM stdin;
\.


--
-- Data for Name: email-template-attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."email-template-attachments" (id, "deletedAt", "createdAt", "updatedAt", "recordId", "emailTemplateId") FROM stdin;
\.


--
-- Data for Name: email-template-trigger-delayed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."email-template-trigger-delayed" (id, email, "timeToSend", "templateId") FROM stdin;
\.


--
-- Data for Name: formresponse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formresponse (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, questionkey, questiontext, response, responsetype, hasbeenderived, isderived, submission) FROM stdin;
\.


--
-- Data for Name: formsubmission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formsubmission (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, type, reference, status, subject, "pdfUrl", uuid, processed) FROM stdin;
\.


--
-- Data for Name: leaderboard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leaderboard (id, score) FROM stdin;
\.


--
-- Data for Name: listing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listing (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "addressLine1", "addressLine2", "postCode", city, cost_pppw, "bedroomCount", "briefDescription", "fullDescription", "agentContactNumber", "holdingFee", "isLive", "billsIncluded", reserved, "contractLength", "availableFrom", "keyFeatures", name, "locationSummary", latitude, longitude, "floorplanURL", "videoURL", "epcURL", "listingMediaId") FROM stdin;
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "colorHex", color, description, "authorUrl", "authorImageUrl", "featuredImageUrl", sort, public, published, author, title, icon, "recordId", "parentId") FROM stdin;
\.


--
-- Data for Name: media_closure; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media_closure (id_ancestor, id_descendant) FROM stdin;
\.


--
-- Data for Name: messagingchatters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messagingchatters (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, active, conversation) FROM stdin;
\.


--
-- Data for Name: messagingconversation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messagingconversation (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, name) FROM stdin;
\.


--
-- Data for Name: messagingconversation_chatters_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messagingconversation_chatters_user ("messagingconversationId", "userId") FROM stdin;
\.


--
-- Data for Name: messagingmessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messagingmessage (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, message, conversation) FROM stdin;
\.


--
-- Data for Name: metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.metadata (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "objId", key, value, type) FROM stdin;
\.


--
-- Data for Name: milestones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.milestones (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, milestones) FROM stdin;
\.


--
-- Data for Name: mortgage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mortgage (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "Reference", "milestonesId", "solitorId", "adminId", "propertyDetailsId", "borrowerDetailsId") FROM stdin;
\.


--
-- Data for Name: mortgage_borrowers_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mortgage_borrowers_user ("mortgageId", "userId") FROM stdin;
\.


--
-- Data for Name: nest_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nest_migrations (id, "timestamp", name) FROM stdin;
1	1637321762576	Initial1637321762576
2	1637598399018	roleUpdate1637598399018
3	1637684026273	update1637684026273
4	1637850272197	KnightsMilestones1637850272197
5	1637926780438	userActivated1637926780438
6	1638273002357	userPasswordresettoken1638273002357
7	1639135319676	emailTemplate1639135319676
8	1641327604680	leaderBoard1641327604680
9	1641563660939	knightsMortgageMilestone1641563660939
10	1642762996482	knightsMortgageMilestonesChanges1642762996482
11	1642767515394	emailTemplateActive1642767515394
12	1643113793098	leaderBoardScore1643113793098
13	1643121209932	emailTemplateRecord1643121209932
14	1643202151817	userNotiTitle1643202151817
15	1643215924174	emailTemplatesAttachments1643215924174
16	1643217509790	emailTemplateTitle1643217509790
17	1643623842649	knightsQuestionnaire1643623842649
18	1643640549966	userLastloggedin1643640549966
19	1643714155001	calendarUnique1643714155001
20	1643715494453	userDeviceToken1643715494453
21	1643903871851	stuff1643903871851
22	1644249855694	messaging1644249855694
23	1644398979891	questionaire1644398979891
24	1644486696777	listing1644486696777
25	1644514832743	uploadChunk1644514832743
26	1645535250303	nullableBase1645535250303
27	1645617740394	mortageUpdates1645617740394
28	1645697078763	xmlAsEntity1645697078763
29	1646407993352	media1646407993352
30	1648138174589	cascadeDelete1648138174589
31	1649067512949	paymentModelsAdditions1649067512949
32	1649250749309	ssuTracker1649250749309
33	1651243030581	ActivatedBorrower1651243030581
1	1637321762576	Initial1637321762576
2	1637598399018	roleUpdate1637598399018
3	1637684026273	update1637684026273
4	1637850272197	KnightsMilestones1637850272197
5	1637926780438	userActivated1637926780438
6	1638273002357	userPasswordresettoken1638273002357
7	1639135319676	emailTemplate1639135319676
8	1641327604680	leaderBoard1641327604680
9	1641563660939	knightsMortgageMilestone1641563660939
10	1642762996482	knightsMortgageMilestonesChanges1642762996482
11	1642767515394	emailTemplateActive1642767515394
12	1643113793098	leaderBoardScore1643113793098
13	1643121209932	emailTemplateRecord1643121209932
14	1643202151817	userNotiTitle1643202151817
15	1643215924174	emailTemplatesAttachments1643215924174
16	1643217509790	emailTemplateTitle1643217509790
17	1643623842649	knightsQuestionnaire1643623842649
18	1643640549966	userLastloggedin1643640549966
19	1643714155001	calendarUnique1643714155001
20	1643715494453	userDeviceToken1643715494453
21	1643903871851	stuff1643903871851
22	1644249855694	messaging1644249855694
23	1644398979891	questionaire1644398979891
24	1644486696777	listing1644486696777
25	1644514832743	uploadChunk1644514832743
26	1645535250303	nullableBase1645535250303
27	1645617740394	mortageUpdates1645617740394
28	1645697078763	xmlAsEntity1645697078763
29	1646407993352	media1646407993352
30	1648138174589	cascadeDelete1648138174589
31	1649067512949	paymentModelsAdditions1649067512949
32	1649250749309	ssuTracker1649250749309
33	1651243030581	ActivatedBorrower1651243030581
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, status, "targetUserId", subject, body, type, "from", "templateId", data) FROM stdin;
\.


--
-- Data for Name: notification_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_permission (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, subject, description) FROM stdin;
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, status, "intentId", "clientSecret", "fullStripeIntent", "paymentAmount", subscription) FROM stdin;
\.


--
-- Data for Name: organisation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisation ("createdAt", "updatedAt", "deletedAt", id, name, deleted, primarycolour, secondarycolour, logourl, appsettings, bundleid, appuniversallink, appstoreid, androidpackageid, appleappstorelink, androidappstorelink, enabledmodules, "tertiaryColour", privacypolicy, readmoretext, public, "contentIsPublic", "emailToSendNotifications", "sharedAppOwner", "hasCustomApp", "addressLineOne", "addressLineTwo", postcode, city, customdomain, subscription, active, admin, hassites, numallowedusers, notes) FROM stdin;
2022-11-02 15:45:43.513263	2022-11-02 15:45:43.513263	\N	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	f	1000	\N
2022-11-02 15:45:43.513263	2022-11-02 15:45:43.513263	\N	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	f	1000	\N
\.


--
-- Data for Name: organisation_users_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisation_users_user ("organisationId", "userId") FROM stdin;
a61e7231-d23c-451c-9847-71cfe927c2e7	17158315-96c3-4c47-a5b7-8e7457ea17b2
a61e7231-d23c-451c-9847-71cfe927c2e7	17158315-96c3-4c47-a5b7-8e7457ea17b2
\.


--
-- Data for Name: organisationcharge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisationcharge (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, cost, description, processed) FROM stdin;
\.


--
-- Data for Name: organisationcontract; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisationcontract (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, cost) FROM stdin;
\.


--
-- Data for Name: organisationemailtemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisationemailtemplate (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, html, name) FROM stdin;
\.


--
-- Data for Name: organisationsubscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisationsubscription (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, name, "friendlyDescription", "statementDescription", "annualFee", "numAllowedUsers") FROM stdin;
\.


--
-- Data for Name: organisationsystemtag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisationsystemtag (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, type, key, value, fieldtype) FROM stdin;
\.


--
-- Data for Name: organisationtag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisationtag (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, type, key, value, fieldtype) FROM stdin;
\.


--
-- Data for Name: organisationuserpurchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisationuserpurchases (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "productId", cost, processed, received) FROM stdin;
\.


--
-- Data for Name: questionaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questionaire (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "Errored", "LastSent", "matterAdminDetailsId", "borrowerDetailsId", "propertyDetailsId", "brokerDetailsId", "keyDatesDetailsId", "leaseholdDetailsId", "surplusShortfallDetailsId", "additionalLandDetailsId", "lenderDetailsId", "mortgageDetailsId", "buildingsInsuranceDetailsId", "occupierDetailsId", "additionalInfoDetailsId") FROM stdin;
\.


--
-- Data for Name: record; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.record (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "fileName", "fileURL", "fileType") FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, title, defaultrole, hidden, permissions) FROM stdin;
2b190df0-7548-481b-afe1-73a5133abcfb	\N	2022-11-02 15:46:51.855672	2022-11-02 15:46:51.855672	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Admin	\N	\N	{}
dedb4f70-c626-46c3-8167-3b72fcbd1abe	\N	2022-11-02 15:46:51.855672	2022-11-02 15:46:51.855672	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Tester	\N	\N	{}
2b190df0-7548-481b-afe1-73a5133abcfb	\N	2022-11-02 15:46:51.855672	2022-11-02 15:46:51.855672	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Admin	\N	\N	{}
dedb4f70-c626-46c3-8167-3b72fcbd1abe	\N	2022-11-02 15:46:51.855672	2022-11-02 15:46:51.855672	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Tester	\N	\N	{}
24eae392-226c-4d47-a725-fca41e0f8ca1	\N	2022-11-04 12:01:39.158964	2022-11-04 12:01:39.158964	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
a4758b36-94cf-4eaa-b43a-48c9c55f58cc	\N	2022-11-04 12:01:39.194635	2022-11-04 12:01:39.194635	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
10c99fd3-797b-434e-8718-0f0a52c5eccf	\N	2022-11-04 12:03:57.136302	2022-11-04 12:03:57.136302	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
24fb59af-708a-491a-97ce-6834da444256	\N	2022-11-04 12:03:57.146477	2022-11-04 12:03:57.146477	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
4d9d5e0d-0417-4569-b85b-e7de1f5705da	\N	2022-11-04 12:04:55.584572	2022-11-04 12:04:55.584572	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
1c805c7f-07aa-4894-9ebc-92433ad891db	\N	2022-11-04 12:04:55.600493	2022-11-04 12:04:55.600493	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
dfac4206-bd3b-4560-aac4-e2267ba4dbef	\N	2022-11-04 12:05:28.770069	2022-11-04 12:05:28.770069	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
4a8b682e-a5fa-4e15-8829-e6f0521274f7	\N	2022-11-04 12:05:28.801094	2022-11-04 12:05:28.801094	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
42b21217-2886-481d-b7e0-506061297f21	\N	2022-11-04 12:07:02.743698	2022-11-04 12:07:02.743698	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
7c086853-a37d-4af8-84c4-23165494ec22	\N	2022-11-04 12:08:06.966571	2022-11-04 12:08:06.966571	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	Our test role	\N	\N	{}
\.


--
-- Data for Name: role_users_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_users_user ("roleId", "userId") FROM stdin;
\.


--
-- Data for Name: roleuser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roleuser (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, role) FROM stdin;
f143735b-0fda-4401-a40f-7146db53a282	\N	2022-11-04 12:01:39.109704	2022-11-04 12:01:39.109704	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
d59c5e63-20c5-4f99-b072-4ceab7dd047e	\N	2022-11-04 12:01:39.144691	2022-11-04 12:01:39.144691	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
bf0cb13a-34c0-4bda-b0e3-dfc617481acb	\N	2022-11-04 12:03:57.086409	2022-11-04 12:03:57.086409	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
a37cb26a-328e-4b52-8a55-cb71c1ad8edb	\N	2022-11-04 12:03:57.096296	2022-11-04 12:03:57.096296	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
ae2b8b88-48fe-48e7-a6c9-2d509482a8dc	\N	2022-11-04 12:04:55.531779	2022-11-04 12:04:55.531779	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
86bd875b-318f-4ca6-afba-3e388c714ac0	\N	2022-11-04 12:04:55.536036	2022-11-04 12:04:55.536036	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
9900866d-44ac-4780-9d49-3ae3bec212a0	\N	2022-11-04 12:05:28.715566	2022-11-04 12:05:28.715566	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
258daec9-39a3-445a-ac3a-6714af2f5f79	\N	2022-11-04 12:05:28.743305	2022-11-04 12:05:28.743305	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
1feb9d8d-fffd-4db7-a646-ba864c160235	\N	2022-11-04 12:07:02.694461	2022-11-04 12:07:02.694461	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
2b5cb609-87b7-48a5-b939-64be156af936	\N	2022-11-04 12:08:06.921276	2022-11-04 12:08:06.921276	17158315-96c3-4c47-a5b7-8e7457ea17b2	a61e7231-d23c-451c-9847-71cfe927c2e7	\N	2b190df0-7548-481b-afe1-73a5133abcfb
\.


--
-- Data for Name: site; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site (id, name, notes, address, postcode, city, "deletedAt", "createdAt", "updatedAt", owner, organisation) FROM stdin;
\.


--
-- Data for Name: siteadmin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.siteadmin (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site) FROM stdin;
\.


--
-- Data for Name: siteuser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.siteuser (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site) FROM stdin;
\.


--
-- Data for Name: statapirequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statapirequest (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, endpoint, "responseStatus", method, "currentOrganisation", "appVersionNumber", "appBuildNumber", "appBundleId", os, "osVersion", "deviceModel") FROM stdin;
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, title, description, "appleId", "googleId") FROM stdin;
\.


--
-- Data for Name: subscriptionreceipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptionreceipt (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, subscription, provider, reference) FROM stdin;
\.


--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, name, "additionalData", type, status, description, "completedBy", "notifyAt") FROM stdin;
\.


--
-- Data for Name: testautoapi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.testautoapi (id, text, "someNumber", "createdAt", "updatedAt", owner, organisation, site) FROM stdin;
\.


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, token, type, "user", expires) FROM stdin;
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
\.


--
-- Data for Name: uploadchunk; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uploadchunk (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, filename, uploadid, index, totalchunks, etag, filepath) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" ("deletedAt", "createdAt", "updatedAt", id, username, password, email, verifyemailtoken, changepassword, mobile, firstname, lastname, devicetoken, deleted, apprated, emailverified, touchid, backendcurrentorganisation, isdeveloper, enabledbcache, reference, ethnicity, gender, "jobTitle", type, dob, "verificationExpires", "verificationCode", isglobaladmin, "addressLineOne", "addressLineTwo", city, postcode, actived, "passwordResetToken", "lastLoggedIn", "stripeConnectAccountId", "selfSignUpProcessed") FROM stdin;
\N	2022-11-02 15:46:12.108916	2022-11-04 12:07:02.421	17158315-96c3-4c47-a5b7-8e7457ea17b2	test@appt.digital	$2a$10$Xz5jtMwL6uNAnY9dud6ZM.fb9hGDQwobL11WP2pDqBklchn.jQ4ha	test@appt.digital	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	user	\N	\N	\N	t	\N	\N	\N	\N	t	\N	2022-11-04 12:08:06.752+00	\N	f
\N	2022-11-02 15:46:12.108916	2022-11-04 12:07:02.421	17158315-96c3-4c47-a5b7-8e7457ea17b2	test@appt.digital	$2a$10$Xz5jtMwL6uNAnY9dud6ZM.fb9hGDQwobL11WP2pDqBklchn.jQ4ha	test@appt.digital	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	user	\N	\N	\N	t	\N	\N	\N	\N	t	\N	2022-11-04 12:08:06.752+00	\N	f
\.


--
-- Data for Name: user_device_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_device_token (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "deviceToken") FROM stdin;
\.


--
-- Data for Name: user_notification_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_notification_permission (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, "permissionId", "canSend") FROM stdin;
\.


--
-- Data for Name: userdirectaccess; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userdirectaccess (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, targetuser, usergrantedaccess) FROM stdin;
\.


--
-- Data for Name: usergroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usergroup (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, name, description, type) FROM stdin;
\.


--
-- Data for Name: usergroupadmin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usergroupadmin (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, usergroup) FROM stdin;
\.


--
-- Data for Name: usergroupmember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usergroupmember (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, usergroup) FROM stdin;
\.


--
-- Data for Name: usernotification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usernotification (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, read, recipient, title, message) FROM stdin;
\.


--
-- Data for Name: usertag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usertag (id, "deletedAt", "createdAt", "updatedAt", owner, organisation, site, type, key, value, fieldtype, sensitivity) FROM stdin;
\.


--
-- Name: nest_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nest_migrations_id_seq', 33, true);


--
-- Name: organisationemailtemplate PK_0121e35b0b029fa85352a72ef6b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationemailtemplate
    ADD CONSTRAINT "PK_0121e35b0b029fa85352a72ef6b" PRIMARY KEY (id);


--
-- Name: organisationsystemtag PK_05874fb64fb414b2c809ab5572d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationsystemtag
    ADD CONSTRAINT "PK_05874fb64fb414b2c809ab5572d" PRIMARY KEY (id);


--
-- Name: KnightsSurplusShortfallDetails PK_05995558603e644fb4ddcc1c837; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsSurplusShortfallDetails"
    ADD CONSTRAINT "PK_05995558603e644fb4ddcc1c837" PRIMARY KEY (id);


--
-- Name: mortgage PK_083a27028d698c1cc2f611f7944; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "PK_083a27028d698c1cc2f611f7944" PRIMARY KEY (id);


--
-- Name: milestones PK_0bdbfe399c777a6a8520ff902d9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT "PK_0bdbfe399c777a6a8520ff902d9" PRIMARY KEY (id);


--
-- Name: KnightsPropertyDetails PK_0dac73e434e8aa8146664a0d314; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsPropertyDetails"
    ADD CONSTRAINT "PK_0dac73e434e8aa8146664a0d314" PRIMARY KEY (id);


--
-- Name: order PK_1031171c13130102495201e3e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);


--
-- Name: KnightsPropertyDetailsQuestionaire PK_109f56c7ef4301a82015e6c6da2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsPropertyDetailsQuestionaire"
    ADD CONSTRAINT "PK_109f56c7ef4301a82015e6c6da2" PRIMARY KEY (id);


--
-- Name: organisationtag PK_1201a5346ae19e9299e2d402b02; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationtag
    ADD CONSTRAINT "PK_1201a5346ae19e9299e2d402b02" PRIMARY KEY (id);


--
-- Name: organisationcontract PK_12d6caee4b20efcc1551b54f751; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationcontract
    ADD CONSTRAINT "PK_12d6caee4b20efcc1551b54f751" PRIMARY KEY (id);


--
-- Name: user_notification_permission PK_1393522449d7218ea404bbe9c66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_permission
    ADD CONSTRAINT "PK_1393522449d7218ea404bbe9c66" PRIMARY KEY (id);


--
-- Name: calendarevent PK_1a120edc9debc2d29d74c53b7be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendarevent
    ADD CONSTRAINT "PK_1a120edc9debc2d29d74c53b7be" PRIMARY KEY (id);


--
-- Name: email-template-trigger-delayed PK_1f0bd746c4cc38831a657ae0bff; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template-trigger-delayed"
    ADD CONSTRAINT "PK_1f0bd746c4cc38831a657ae0bff" PRIMARY KEY (id);


--
-- Name: KnightsKeyDatesDetails PK_1f4ff4833545c72b8f1cc6227f6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsKeyDatesDetails"
    ADD CONSTRAINT "PK_1f4ff4833545c72b8f1cc6227f6" PRIMARY KEY (id);


--
-- Name: notification_permission PK_20a29edcd85d90a89111ed6a190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_permission
    ADD CONSTRAINT "PK_20a29edcd85d90a89111ed6a190" PRIMARY KEY (id);


--
-- Name: OrganisationProduct PK_2367522be813fafd1275a01f9fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationProduct"
    ADD CONSTRAINT "PK_2367522be813fafd1275a01f9fb" PRIMARY KEY (id);


--
-- Name: activatedborrower PK_2953adafff24dbf8815a93cb59e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activatedborrower
    ADD CONSTRAINT "PK_2953adafff24dbf8815a93cb59e" PRIMARY KEY (id);


--
-- Name: messagingconversation PK_2968d7a2ec7fd5755bb4a66d519; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingconversation
    ADD CONSTRAINT "PK_2968d7a2ec7fd5755bb4a66d519" PRIMARY KEY (id);


--
-- Name: listing PK_381d45ebb8692362c156d6b87d7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY (id);


--
-- Name: KnightsLenderDetails PK_38ffb3a1e3938b5ab4fcafd2eaa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsLenderDetails"
    ADD CONSTRAINT "PK_38ffb3a1e3938b5ab4fcafd2eaa" PRIMARY KEY (id);


--
-- Name: messagingmessage PK_3b07e7666f1c4011cf993d9a298; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingmessage
    ADD CONSTRAINT "PK_3b07e7666f1c4011cf993d9a298" PRIMARY KEY (id);


--
-- Name: role_users_user PK_46403d6ce64cde119287c876ca3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_users_user
    ADD CONSTRAINT "PK_46403d6ce64cde119287c876ca3" PRIMARY KEY ("roleId", "userId");


--
-- Name: KnightsBorrowerDetailsQuestionaire PK_4b2d04f476db91b70b971d5722e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsBorrowerDetailsQuestionaire"
    ADD CONSTRAINT "PK_4b2d04f476db91b70b971d5722e" PRIMARY KEY (id);


--
-- Name: KnightsLeaseholdDetails PK_4b479fae99da79d7ee007b94ba6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsLeaseholdDetails"
    ADD CONSTRAINT "PK_4b479fae99da79d7ee007b94ba6" PRIMARY KEY (id);


--
-- Name: organisationuserpurchases PK_4cc9d3f4694ddea5db24f5948bf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationuserpurchases
    ADD CONSTRAINT "PK_4cc9d3f4694ddea5db24f5948bf" PRIMARY KEY (id);


--
-- Name: questionaire PK_4ddc64410a1958b3d37c51babd5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "PK_4ddc64410a1958b3d37c51babd5" PRIMARY KEY (id);


--
-- Name: subscriptionreceipt PK_4fe0d276168c352087d1e92242a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptionreceipt
    ADD CONSTRAINT "PK_4fe0d276168c352087d1e92242a" PRIMARY KEY (id);


--
-- Name: usertag PK_51029928879e0a9003d42afee46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usertag
    ADD CONSTRAINT "PK_51029928879e0a9003d42afee46" PRIMARY KEY (id);


--
-- Name: statapirequest PK_51195327d508c5893b7d16497dc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statapirequest
    ADD CONSTRAINT "PK_51195327d508c5893b7d16497dc" PRIMARY KEY (id);


--
-- Name: metadata PK_56b22355e89941b9792c04ab176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metadata
    ADD CONSTRAINT "PK_56b22355e89941b9792c04ab176" PRIMARY KEY (id);


--
-- Name: apptledger PK_584cd8e5a797ac12ff98553555a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apptledger
    ADD CONSTRAINT "PK_584cd8e5a797ac12ff98553555a" PRIMARY KEY (id);


--
-- Name: record PK_5cb1f4d1aff275cf9001f4343b9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY (id);


--
-- Name: KnightsBuildingsInsuranceDetails PK_632dcee4d98f052d8cc10f100e5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsBuildingsInsuranceDetails"
    ADD CONSTRAINT "PK_632dcee4d98f052d8cc10f100e5" PRIMARY KEY (id);


--
-- Name: site PK_635c0eeabda8862d5b0237b42b4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site
    ADD CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY (id);


--
-- Name: KnightsBrokerDetails PK_658b5b22d3ec32b398b48c52878; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsBrokerDetails"
    ADD CONSTRAINT "PK_658b5b22d3ec32b398b48c52878" PRIMARY KEY (id);


--
-- Name: roleuser PK_68c1de684575f4bf98380af5a28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT "PK_68c1de684575f4bf98380af5a28" PRIMARY KEY (id);


--
-- Name: notification PK_705b6c7cdf9b2c2ff7ac7872cb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id);


--
-- Name: messagingconversation_chatters_user PK_75f1680ebee644fd607a657869c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingconversation_chatters_user
    ADD CONSTRAINT "PK_75f1680ebee644fd607a657869c" PRIMARY KEY ("messagingconversationId", "userId");


--
-- Name: leaderboard PK_76fd1d52cf44d209920f73f4608; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT "PK_76fd1d52cf44d209920f73f4608" PRIMARY KEY (id);


--
-- Name: siteuser PK_7bbcae9074757a9777f86a730e7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siteuser
    ADD CONSTRAINT "PK_7bbcae9074757a9777f86a730e7" PRIMARY KEY (id);


--
-- Name: token PK_82fae97f905930df5d62a702fc9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY (id);


--
-- Name: uploadchunk PK_84b671d09cf860d5aa9eac312dd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploadchunk
    ADD CONSTRAINT "PK_84b671d09cf860d5aa9eac312dd" PRIMARY KEY (id);


--
-- Name: organisationsubscription PK_8513af61de0dd667f3fb5d44f22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationsubscription
    ADD CONSTRAINT "PK_8513af61de0dd667f3fb5d44f22" PRIMARY KEY (id);


--
-- Name: email-template PK_85f62c144b7cc9f777168bf0093; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template"
    ADD CONSTRAINT "PK_85f62c144b7cc9f777168bf0093" PRIMARY KEY (id);


--
-- Name: messagingchatters PK_88ccb6fb9f3c25e077dd18b67e1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingchatters
    ADD CONSTRAINT "PK_88ccb6fb9f3c25e077dd18b67e1" PRIMARY KEY (id);


--
-- Name: subscription PK_8c3e00ebd02103caa1174cd5d9d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY (id);


--
-- Name: chunkupload PK_8d45810b158c3910fb3c2be12a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chunkupload
    ADD CONSTRAINT "PK_8d45810b158c3910fb3c2be12a4" PRIMARY KEY (id);


--
-- Name: usergroupmember PK_908e9dc775d2b98b9e55ed383b0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroupmember
    ADD CONSTRAINT "PK_908e9dc775d2b98b9e55ed383b0" PRIMARY KEY (id);


--
-- Name: media_closure PK_973adbf5c62cab758c53a7523eb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_closure
    ADD CONSTRAINT "PK_973adbf5c62cab758c53a7523eb" PRIMARY KEY (id_ancestor, id_descendant);


--
-- Name: email-template-attachments PK_97babaf49c2868a17842166bd07; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template-attachments"
    ADD CONSTRAINT "PK_97babaf49c2868a17842166bd07" PRIMARY KEY (id);


--
-- Name: user_device_token PK_a168517a166d3a4fa4e13790442; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_device_token
    ADD CONSTRAINT "PK_a168517a166d3a4fa4e13790442" PRIMARY KEY (id);


--
-- Name: usergroup PK_a5c402b112d56d89a5b6ca69dc7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroup
    ADD CONSTRAINT "PK_a5c402b112d56d89a5b6ca69dc7" PRIMARY KEY (id);


--
-- Name: KnightsSolitor PK_b52270c9b065bc8a8cccc25903c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsSolitor"
    ADD CONSTRAINT "PK_b52270c9b065bc8a8cccc25903c" PRIMARY KEY (id);


--
-- Name: KnightsBorrowerDetails PK_bc393161401a4c9d43e6aec5c4d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsBorrowerDetails"
    ADD CONSTRAINT "PK_bc393161401a4c9d43e6aec5c4d" PRIMARY KEY (id);


--
-- Name: testautoapi PK_c5247c9def8a70440d7d9a10b87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testautoapi
    ADD CONSTRAINT "PK_c5247c9def8a70440d7d9a10b87" PRIMARY KEY (id);


--
-- Name: MediaRestriction PK_c72b0cbcffd52e25f222bbd9077; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaRestriction"
    ADD CONSTRAINT "PK_c72b0cbcffd52e25f222bbd9077" PRIMARY KEY (id);


--
-- Name: KnightsMatterAdminDetails PK_c916d8bd854e64439f7f1621632; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsMatterAdminDetails"
    ADD CONSTRAINT "PK_c916d8bd854e64439f7f1621632" PRIMARY KEY (id);


--
-- Name: siteadmin PK_ccee76a4a92251793d9d89a2735; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siteadmin
    ADD CONSTRAINT "PK_ccee76a4a92251793d9d89a2735" PRIMARY KEY (id);


--
-- Name: usergroupadmin PK_d05557271d69746fa42bb1225e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroupadmin
    ADD CONSTRAINT "PK_d05557271d69746fa42bb1225e2" PRIMARY KEY (id);


--
-- Name: userdirectaccess PK_d877ad6d5e0fc38184050a51f4e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdirectaccess
    ADD CONSTRAINT "PK_d877ad6d5e0fc38184050a51f4e" PRIMARY KEY (id);


--
-- Name: organisationcharge PK_d8c8e2669814a3fa1a7ea8e606d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationcharge
    ADD CONSTRAINT "PK_d8c8e2669814a3fa1a7ea8e606d" PRIMARY KEY (id);


--
-- Name: KnightsOccupierDetails PK_da33d81993b15923871521346ce; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsOccupierDetails"
    ADD CONSTRAINT "PK_da33d81993b15923871521346ce" PRIMARY KEY (id);


--
-- Name: KnightsMortgageDetails PK_da4d7a5fbe0c4dc00f3f0f599a0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsMortgageDetails"
    ADD CONSTRAINT "PK_da4d7a5fbe0c4dc00f3f0f599a0" PRIMARY KEY (id);


--
-- Name: KnightsAdditionalInfoDetails PK_dc6641b404a0783bd15b9dcdc54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsAdditionalInfoDetails"
    ADD CONSTRAINT "PK_dc6641b404a0783bd15b9dcdc54" PRIMARY KEY (id);


--
-- Name: mortgage_borrowers_user PK_e09c55e1bf0d7ba63e5d459082c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage_borrowers_user
    ADD CONSTRAINT "PK_e09c55e1bf0d7ba63e5d459082c" PRIMARY KEY ("mortgageId", "userId");


--
-- Name: KnightsAdditionalLandDetails PK_e1130c40273f22d44b9839510ad; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsAdditionalLandDetails"
    ADD CONSTRAINT "PK_e1130c40273f22d44b9839510ad" PRIMARY KEY (id);


--
-- Name: KnightsAdmin PK_e25e5013d1d3985577ca3c0c176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."KnightsAdmin"
    ADD CONSTRAINT "PK_e25e5013d1d3985577ca3c0c176" PRIMARY KEY (id);


--
-- Name: calendareventattendees PK_e312bed49f8a44c89879cd53843; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendareventattendees
    ADD CONSTRAINT "PK_e312bed49f8a44c89879cd53843" PRIMARY KEY (id);


--
-- Name: audittrail PK_ea39c91bdd366094aa8480d5adf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audittrail
    ADD CONSTRAINT "PK_ea39c91bdd366094aa8480d5adf" PRIMARY KEY (id);


--
-- Name: formsubmission PK_efdbb168b75395182a23d182922; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formsubmission
    ADD CONSTRAINT "PK_efdbb168b75395182a23d182922" PRIMARY KEY (id);


--
-- Name: apitoken PK_f4ae473a5df1c61450f23328ca1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apitoken
    ADD CONSTRAINT "PK_f4ae473a5df1c61450f23328ca1" PRIMARY KEY (id);


--
-- Name: media PK_f4e0fcac36e050de337b670d8bd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY (id);


--
-- Name: formresponse PK_f7e21a9ad2d7ae69837354ee09a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formresponse
    ADD CONSTRAINT "PK_f7e21a9ad2d7ae69837354ee09a" PRIMARY KEY (id);


--
-- Name: usernotification PK_f9113ad8b473ce4762ec147c5d1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usernotification
    ADD CONSTRAINT "PK_f9113ad8b473ce4762ec147c5d1" PRIMARY KEY (id);


--
-- Name: task PK_fb213f79ee45060ba925ecd576e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY (id);


--
-- Name: media REL_654be1f970850ab5b0acfc13a9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT "REL_654be1f970850ab5b0acfc13a9" UNIQUE ("recordId");


--
-- Name: MediaRestriction REL_acaad8292196b42cc9a59ba5b5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaRestriction"
    ADD CONSTRAINT "REL_acaad8292196b42cc9a59ba5b5" UNIQUE ("userDeniedId ");


--
-- Name: MediaRestriction REL_e658fae3011dcdd6b55ee2272a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaRestriction"
    ADD CONSTRAINT "REL_e658fae3011dcdd6b55ee2272a" UNIQUE ("subscriptionId");


--
-- Name: MediaRestriction REL_e76daffc224f1a7e8bf748f017; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaRestriction"
    ADD CONSTRAINT "REL_e76daffc224f1a7e8bf748f017" UNIQUE ("roleId");


--
-- Name: mortgage UQ_02a19f319d95c5f9a4b8f1ec7d7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "UQ_02a19f319d95c5f9a4b8f1ec7d7" UNIQUE ("propertyDetailsId");


--
-- Name: questionaire UQ_4ba1963e0c92df114a1f11be10a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_4ba1963e0c92df114a1f11be10a" UNIQUE ("mortgageDetailsId");


--
-- Name: questionaire UQ_59c5426b85bf268e9b62d030115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_59c5426b85bf268e9b62d030115" UNIQUE ("surplusShortfallDetailsId");


--
-- Name: mortgage UQ_72627b52398fd4dca417ca7efe1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "UQ_72627b52398fd4dca417ca7efe1" UNIQUE ("solitorId");


--
-- Name: questionaire UQ_749f60ae8c154842db567d0b0bb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_749f60ae8c154842db567d0b0bb" UNIQUE ("propertyDetailsId");


--
-- Name: mortgage UQ_7664b3ca421f114165e023ee024; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "UQ_7664b3ca421f114165e023ee024" UNIQUE ("borrowerDetailsId");


--
-- Name: calendareventattendees UQ_7956be7945a647e93a983774755; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendareventattendees
    ADD CONSTRAINT "UQ_7956be7945a647e93a983774755" UNIQUE (event, attendee);


--
-- Name: notification_permission UQ_93e154861ebe970688b829e345b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_permission
    ADD CONSTRAINT "UQ_93e154861ebe970688b829e345b" UNIQUE (subject);


--
-- Name: mortgage UQ_9e1d6f393cee76684602300aabb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "UQ_9e1d6f393cee76684602300aabb" UNIQUE ("adminId");


--
-- Name: mortgage UQ_a197641ff3ca4859feaeb76ee9b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "UQ_a197641ff3ca4859feaeb76ee9b" UNIQUE ("milestonesId");


--
-- Name: questionaire UQ_a41c15a1cb17442ce263a12432f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_a41c15a1cb17442ce263a12432f" UNIQUE ("additionalLandDetailsId");


--
-- Name: questionaire UQ_c4fffd634e362b9b85d3ddaef4e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_c4fffd634e362b9b85d3ddaef4e" UNIQUE ("buildingsInsuranceDetailsId");


--
-- Name: email-template-trigger-delayed UQ_cc61ee0a405382aa609e573b6b3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template-trigger-delayed"
    ADD CONSTRAINT "UQ_cc61ee0a405382aa609e573b6b3" UNIQUE ("templateId");


--
-- Name: questionaire UQ_d0565f2ad0d10ed8327d2e8663d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_d0565f2ad0d10ed8327d2e8663d" UNIQUE ("occupierDetailsId");


--
-- Name: questionaire UQ_d81c3dec32d2a81a09633955896; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_d81c3dec32d2a81a09633955896" UNIQUE ("lenderDetailsId");


--
-- Name: mortgage UQ_d8acff9d76c83ffa7597339f96d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "UQ_d8acff9d76c83ffa7597339f96d" UNIQUE ("Reference");


--
-- Name: questionaire UQ_dd144a5acd8e1701d9ca5e92bc1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_dd144a5acd8e1701d9ca5e92bc1" UNIQUE ("leaseholdDetailsId");


--
-- Name: questionaire UQ_de08dcd85b2717347ba2d292d33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_de08dcd85b2717347ba2d292d33" UNIQUE ("borrowerDetailsId");


--
-- Name: questionaire UQ_de2aa762c5a1b86d61a6b048e7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_de2aa762c5a1b86d61a6b048e7d" UNIQUE ("keyDatesDetailsId");


--
-- Name: questionaire UQ_e4ac24281352f4363be71da64a2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_e4ac24281352f4363be71da64a2" UNIQUE ("brokerDetailsId");


--
-- Name: questionaire UQ_f01c2d33c2f8bde4695cc14d7a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_f01c2d33c2f8bde4695cc14d7a8" UNIQUE ("matterAdminDetailsId");


--
-- Name: questionaire UQ_fdf5f2e28682092c349413236f3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "UQ_fdf5f2e28682092c349413236f3" UNIQUE ("additionalInfoDetailsId");


--
-- Name: IDX_17036a64e81d3975bc73ab0df2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_17036a64e81d3975bc73ab0df2" ON public.messagingconversation_chatters_user USING btree ("userId");


--
-- Name: IDX_261fa3d243508bfc94e45405e2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_261fa3d243508bfc94e45405e2" ON public.organisation_users_user USING btree ("userId");


--
-- Name: IDX_3344dc048ca0633790213ca368; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3344dc048ca0633790213ca368" ON public.messagingconversation_chatters_user USING btree ("messagingconversationId");


--
-- Name: IDX_363bd896c9058b80b0bbf1a17b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_363bd896c9058b80b0bbf1a17b" ON public.user_device_token USING btree ("deviceToken");


--
-- Name: IDX_3fd33a53717959eaca3284edc9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3fd33a53717959eaca3284edc9" ON public.organisation_users_user USING btree ("organisationId");


--
-- Name: IDX_4044abad04379047d296b8bbd8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4044abad04379047d296b8bbd8" ON public.media_closure USING btree (id_ancestor);


--
-- Name: IDX_58737eecfe822cd2199f93816a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_58737eecfe822cd2199f93816a" ON public.mortgage_borrowers_user USING btree ("userId");


--
-- Name: IDX_96e9bcf7f1aa20192c649df850; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_96e9bcf7f1aa20192c649df850" ON public.mortgage_borrowers_user USING btree ("mortgageId");


--
-- Name: IDX_a88fcb405b56bf2e2646e9d479; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a88fcb405b56bf2e2646e9d479" ON public.role_users_user USING btree ("userId");


--
-- Name: IDX_e2533444b03507af1e86bfc39a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e2533444b03507af1e86bfc39a" ON public.media_closure USING btree (id_descendant);


--
-- Name: IDX_ed6edac7184b013d4bd58d60e5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ed6edac7184b013d4bd58d60e5" ON public.role_users_user USING btree ("roleId");


--
-- Name: mortgage FK_02a19f319d95c5f9a4b8f1ec7d7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "FK_02a19f319d95c5f9a4b8f1ec7d7" FOREIGN KEY ("propertyDetailsId") REFERENCES public."KnightsPropertyDetails"(id);


--
-- Name: listing FK_04b2821ce513622c6cb67bed448; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT "FK_04b2821ce513622c6cb67bed448" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: calendareventattendees FK_073180c13f38b3575c5d4c19536; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendareventattendees
    ADD CONSTRAINT "FK_073180c13f38b3575c5d4c19536" FOREIGN KEY (event) REFERENCES public.calendarevent(id) ON DELETE CASCADE;


--
-- Name: organisationcharge FK_0881219f1a9013e5e8eb1965e89; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationcharge
    ADD CONSTRAINT "FK_0881219f1a9013e5e8eb1965e89" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: statapirequest FK_0a03b783561333e31063a5042de; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statapirequest
    ADD CONSTRAINT "FK_0a03b783561333e31063a5042de" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: listing FK_0a1bcdce36507666178732bf10c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT "FK_0a1bcdce36507666178732bf10c" FOREIGN KEY ("listingMediaId") REFERENCES public.record(id);


--
-- Name: messagingconversation FK_110b7f15b3926696b47b591c7e9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingconversation
    ADD CONSTRAINT "FK_110b7f15b3926696b47b591c7e9" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: notification FK_11fb817c4c06fd5b1b07a83e185; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_11fb817c4c06fd5b1b07a83e185" FOREIGN KEY ("templateId") REFERENCES public.organisationemailtemplate(id);


--
-- Name: OrganisationProduct FK_12723217c6662ca15c31a5b3096; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationProduct"
    ADD CONSTRAINT "FK_12723217c6662ca15c31a5b3096" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: record FK_161f4639ce9a9fa218b9a7d724a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.record
    ADD CONSTRAINT "FK_161f4639ce9a9fa218b9a7d724a" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: calendarevent FK_1643b7972a5db192451dfef895e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendarevent
    ADD CONSTRAINT "FK_1643b7972a5db192451dfef895e" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: organisationuserpurchases FK_1755b1a9b750c809a48a1cb48ee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationuserpurchases
    ADD CONSTRAINT "FK_1755b1a9b750c809a48a1cb48ee" FOREIGN KEY ("productId") REFERENCES public."OrganisationProduct"(id);


--
-- Name: usergroupmember FK_1b5ae92072e68e353b0ef2fffc3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroupmember
    ADD CONSTRAINT "FK_1b5ae92072e68e353b0ef2fffc3" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: testautoapi FK_24153191d3ae522f1421687cbbe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testautoapi
    ADD CONSTRAINT "FK_24153191d3ae522f1421687cbbe" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: email-template FK_275bc16a2e6a0c6e638c5c2348e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template"
    ADD CONSTRAINT "FK_275bc16a2e6a0c6e638c5c2348e" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: organisationemailtemplate FK_2d8238a0194ce58b2701f32dc2a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationemailtemplate
    ADD CONSTRAINT "FK_2d8238a0194ce58b2701f32dc2a" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: messagingchatters FK_32dd35ade082596ea9e5b3da722; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingchatters
    ADD CONSTRAINT "FK_32dd35ade082596ea9e5b3da722" FOREIGN KEY (conversation) REFERENCES public.messagingconversation(id);


--
-- Name: messagingconversation_chatters_user FK_3344dc048ca0633790213ca368b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingconversation_chatters_user
    ADD CONSTRAINT "FK_3344dc048ca0633790213ca368b" FOREIGN KEY ("messagingconversationId") REFERENCES public.messagingconversation(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: siteadmin FK_34261d51aed503feeadfd0114c9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siteadmin
    ADD CONSTRAINT "FK_34261d51aed503feeadfd0114c9" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: media_closure FK_4044abad04379047d296b8bbd83; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_closure
    ADD CONSTRAINT "FK_4044abad04379047d296b8bbd83" FOREIGN KEY (id_ancestor) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: notification_permission FK_445aba1237f16cdf7335d5e73d6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_permission
    ADD CONSTRAINT "FK_445aba1237f16cdf7335d5e73d6" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: messagingmessage FK_47aa06c15ddcee4ff630cd9427c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingmessage
    ADD CONSTRAINT "FK_47aa06c15ddcee4ff630cd9427c" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: apitoken FK_4b94a32add8133704bcaee91cbe; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apitoken
    ADD CONSTRAINT "FK_4b94a32add8133704bcaee91cbe" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_4ba1963e0c92df114a1f11be10a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_4ba1963e0c92df114a1f11be10a" FOREIGN KEY ("mortgageDetailsId") REFERENCES public."KnightsMortgageDetails"(id);


--
-- Name: order FK_50e46c9bda16884ad88f31e2270; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_50e46c9bda16884ad88f31e2270" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: MediaRestriction FK_5491c0892e2f5e95524b1a0c2cd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaRestriction"
    ADD CONSTRAINT "FK_5491c0892e2f5e95524b1a0c2cd" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: user_device_token FK_58b6195fee552c4fe04498ce6fd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_device_token
    ADD CONSTRAINT "FK_58b6195fee552c4fe04498ce6fd" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_59c5426b85bf268e9b62d030115; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_59c5426b85bf268e9b62d030115" FOREIGN KEY ("surplusShortfallDetailsId") REFERENCES public."KnightsSurplusShortfallDetails"(id);


--
-- Name: media FK_654be1f970850ab5b0acfc13a9d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT "FK_654be1f970850ab5b0acfc13a9d" FOREIGN KEY ("recordId") REFERENCES public.record(id) ON DELETE SET NULL;


--
-- Name: organisationsystemtag FK_674b9d3f4ba8cb7b2a440825cc7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationsystemtag
    ADD CONSTRAINT "FK_674b9d3f4ba8cb7b2a440825cc7" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: user_notification_permission FK_6bc694435141de73f49bd1adf47; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_permission
    ADD CONSTRAINT "FK_6bc694435141de73f49bd1adf47" FOREIGN KEY ("permissionId") REFERENCES public.notification_permission(id);


--
-- Name: mortgage FK_72627b52398fd4dca417ca7efe1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "FK_72627b52398fd4dca417ca7efe1" FOREIGN KEY ("solitorId") REFERENCES public."KnightsSolitor"(id);


--
-- Name: questionaire FK_749f60ae8c154842db567d0b0bb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_749f60ae8c154842db567d0b0bb" FOREIGN KEY ("propertyDetailsId") REFERENCES public."KnightsPropertyDetailsQuestionaire"(id);


--
-- Name: mortgage FK_7664b3ca421f114165e023ee024; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "FK_7664b3ca421f114165e023ee024" FOREIGN KEY ("borrowerDetailsId") REFERENCES public."KnightsBorrowerDetails"(id);


--
-- Name: userdirectaccess FK_7db91d85ecf0c55410e0363c421; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userdirectaccess
    ADD CONSTRAINT "FK_7db91d85ecf0c55410e0363c421" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_7f8ed9e2fe858785bc9da56e917; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_7f8ed9e2fe858785bc9da56e917" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: MediaRestriction FK_856cb5a8c1e65913e9eb845986a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaRestriction"
    ADD CONSTRAINT "FK_856cb5a8c1e65913e9eb845986a" FOREIGN KEY ("mediaId") REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: formresponse FK_87c214454b47e63ceead212737e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formresponse
    ADD CONSTRAINT "FK_87c214454b47e63ceead212737e" FOREIGN KEY (submission) REFERENCES public.formsubmission(id) ON DELETE CASCADE;


--
-- Name: role FK_8ceff5ecf8d0661154ba3ae3382; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "FK_8ceff5ecf8d0661154ba3ae3382" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: user_notification_permission FK_91900b741d4ffe03f6d4499cd7b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notification_permission
    ADD CONSTRAINT "FK_91900b741d4ffe03f6d4499cd7b" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: mortgage_borrowers_user FK_96e9bcf7f1aa20192c649df8502; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage_borrowers_user
    ADD CONSTRAINT "FK_96e9bcf7f1aa20192c649df8502" FOREIGN KEY ("mortgageId") REFERENCES public.mortgage(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audittrail FK_99434fe4a7387c9d10573e65d65; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audittrail
    ADD CONSTRAINT "FK_99434fe4a7387c9d10573e65d65" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: mortgage FK_9e1d6f393cee76684602300aabb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "FK_9e1d6f393cee76684602300aabb" FOREIGN KEY ("adminId") REFERENCES public."KnightsAdmin"(id);


--
-- Name: email-template-attachments FK_9e35c6f800edb17c91453867abf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template-attachments"
    ADD CONSTRAINT "FK_9e35c6f800edb17c91453867abf" FOREIGN KEY ("emailTemplateId") REFERENCES public."email-template"(id);


--
-- Name: usergroupadmin FK_a0040189b70c544d4d07a2736c3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroupadmin
    ADD CONSTRAINT "FK_a0040189b70c544d4d07a2736c3" FOREIGN KEY (usergroup) REFERENCES public.usergroup(id);


--
-- Name: mortgage FK_a197641ff3ca4859feaeb76ee9b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "FK_a197641ff3ca4859feaeb76ee9b" FOREIGN KEY ("milestonesId") REFERENCES public.milestones(id);


--
-- Name: organisationtag FK_a2104fc457f7c707c74a6b9aefb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationtag
    ADD CONSTRAINT "FK_a2104fc457f7c707c74a6b9aefb" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_a41c15a1cb17442ce263a12432f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_a41c15a1cb17442ce263a12432f" FOREIGN KEY ("additionalLandDetailsId") REFERENCES public."KnightsAdditionalLandDetails"(id);


--
-- Name: organisationcontract FK_ad0c7af1893106d2d99f3fc9e74; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationcontract
    ADD CONSTRAINT "FK_ad0c7af1893106d2d99f3fc9e74" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: usernotification FK_ad755556f3c280af7486dc71382; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usernotification
    ADD CONSTRAINT "FK_ad755556f3c280af7486dc71382" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: usertag FK_b7ab98f8e24ee993e9ff278664f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usertag
    ADD CONSTRAINT "FK_b7ab98f8e24ee993e9ff278664f" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: subscriptionreceipt FK_bafa40d22046fe839044cd6bbe6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptionreceipt
    ADD CONSTRAINT "FK_bafa40d22046fe839044cd6bbe6" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: mortgage FK_c0274c9c3be13d6d1a196dfbab3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortgage
    ADD CONSTRAINT "FK_c0274c9c3be13d6d1a196dfbab3" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: activatedborrower FK_c1beb4c5c786c2d4aa9b5be8db2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activatedborrower
    ADD CONSTRAINT "FK_c1beb4c5c786c2d4aa9b5be8db2" FOREIGN KEY ("mortgageId") REFERENCES public.mortgage(id);


--
-- Name: notification FK_c37d1f7f812fbb42fc3674c1a30; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_c37d1f7f812fbb42fc3674c1a30" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_c4fffd634e362b9b85d3ddaef4e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_c4fffd634e362b9b85d3ddaef4e" FOREIGN KEY ("buildingsInsuranceDetailsId") REFERENCES public."KnightsBuildingsInsuranceDetails"(id);


--
-- Name: metadata FK_c82e4b95e589fef5b0741b887a2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metadata
    ADD CONSTRAINT "FK_c82e4b95e589fef5b0741b887a2" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: formsubmission FK_c8985fa786cbccdb54d75f506f1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formsubmission
    ADD CONSTRAINT "FK_c8985fa786cbccdb54d75f506f1" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: subscription FK_cb896287d5a60c517601826d5ea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription
    ADD CONSTRAINT "FK_cb896287d5a60c517601826d5ea" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: email-template-trigger-delayed FK_cc61ee0a405382aa609e573b6b3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template-trigger-delayed"
    ADD CONSTRAINT "FK_cc61ee0a405382aa609e573b6b3" FOREIGN KEY ("templateId") REFERENCES public."email-template"(id);


--
-- Name: messagingchatters FK_cec99dfb805697f1e7c6a6ea29d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingchatters
    ADD CONSTRAINT "FK_cec99dfb805697f1e7c6a6ea29d" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_d0565f2ad0d10ed8327d2e8663d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_d0565f2ad0d10ed8327d2e8663d" FOREIGN KEY ("occupierDetailsId") REFERENCES public."KnightsOccupierDetails"(id);


--
-- Name: task FK_d0c8c8f1bb4a5e1cb8535415de7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT "FK_d0c8c8f1bb4a5e1cb8535415de7" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: organisationuserpurchases FK_d1c0d484ebe3fb700b34857e224; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationuserpurchases
    ADD CONSTRAINT "FK_d1c0d484ebe3fb700b34857e224" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: chunkupload FK_d56f8f4ed347ff7997a4d03c482; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chunkupload
    ADD CONSTRAINT "FK_d56f8f4ed347ff7997a4d03c482" FOREIGN KEY ("finishedRecordId") REFERENCES public.record(id) ON DELETE CASCADE;


--
-- Name: milestones FK_d636b560a8295ca4152a18d50f0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.milestones
    ADD CONSTRAINT "FK_d636b560a8295ca4152a18d50f0" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_d81c3dec32d2a81a09633955896; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_d81c3dec32d2a81a09633955896" FOREIGN KEY ("lenderDetailsId") REFERENCES public."KnightsLenderDetails"(id);


--
-- Name: email-template-attachments FK_dc8ba142fcf626b5a0dcc3d3fc1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template-attachments"
    ADD CONSTRAINT "FK_dc8ba142fcf626b5a0dcc3d3fc1" FOREIGN KEY ("recordId") REFERENCES public.record(id);


--
-- Name: questionaire FK_dd144a5acd8e1701d9ca5e92bc1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_dd144a5acd8e1701d9ca5e92bc1" FOREIGN KEY ("leaseholdDetailsId") REFERENCES public."KnightsLeaseholdDetails"(id);


--
-- Name: questionaire FK_de08dcd85b2717347ba2d292d33; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_de08dcd85b2717347ba2d292d33" FOREIGN KEY ("borrowerDetailsId") REFERENCES public."KnightsBorrowerDetailsQuestionaire"(id);


--
-- Name: questionaire FK_de2aa762c5a1b86d61a6b048e7d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_de2aa762c5a1b86d61a6b048e7d" FOREIGN KEY ("keyDatesDetailsId") REFERENCES public."KnightsKeyDatesDetails"(id);


--
-- Name: email-template FK_e1c6cf9ca257f995cffb728d36a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."email-template"
    ADD CONSTRAINT "FK_e1c6cf9ca257f995cffb728d36a" FOREIGN KEY ("templateId") REFERENCES public.organisationemailtemplate(id);


--
-- Name: media_closure FK_e2533444b03507af1e86bfc39a6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media_closure
    ADD CONSTRAINT "FK_e2533444b03507af1e86bfc39a6" FOREIGN KEY (id_descendant) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: questionaire FK_e4ac24281352f4363be71da64a2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_e4ac24281352f4363be71da64a2" FOREIGN KEY ("brokerDetailsId") REFERENCES public."KnightsBrokerDetails"(id);


--
-- Name: calendareventattendees FK_e55f795950d23cce06ea73480e3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendareventattendees
    ADD CONSTRAINT "FK_e55f795950d23cce06ea73480e3" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: uploadchunk FK_e61da14b05edb5e596dcc17c796; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploadchunk
    ADD CONSTRAINT "FK_e61da14b05edb5e596dcc17c796" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: MediaRestriction FK_e658fae3011dcdd6b55ee2272ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaRestriction"
    ADD CONSTRAINT "FK_e658fae3011dcdd6b55ee2272ad" FOREIGN KEY ("subscriptionId") REFERENCES public.subscription(id);


--
-- Name: formresponse FK_e80ae199941adbd83f373f3d3bd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formresponse
    ADD CONSTRAINT "FK_e80ae199941adbd83f373f3d3bd" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: usergroup FK_e8af1df6b51a1923f9c9b550b0e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroup
    ADD CONSTRAINT "FK_e8af1df6b51a1923f9c9b550b0e" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: subscriptionreceipt FK_eaacda6f1b14347d80f69c55aa5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptionreceipt
    ADD CONSTRAINT "FK_eaacda6f1b14347d80f69c55aa5" FOREIGN KEY (subscription) REFERENCES public.subscription(id);


--
-- Name: media FK_eb7d844b9d1734284203fbf5087; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT "FK_eb7d844b9d1734284203fbf5087" FOREIGN KEY ("parentId") REFERENCES public.media(id);


--
-- Name: usergroupmember FK_ec7d9d18f844b08411b7f61accb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroupmember
    ADD CONSTRAINT "FK_ec7d9d18f844b08411b7f61accb" FOREIGN KEY (usergroup) REFERENCES public.usergroup(id);


--
-- Name: questionaire FK_f01c2d33c2f8bde4695cc14d7a8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_f01c2d33c2f8bde4695cc14d7a8" FOREIGN KEY ("matterAdminDetailsId") REFERENCES public."KnightsMatterAdminDetails"(id);


--
-- Name: siteuser FK_f056a0b19a922f52e55c98f5c6e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siteuser
    ADD CONSTRAINT "FK_f056a0b19a922f52e55c98f5c6e" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: chunkupload FK_f22261008df274279a856bbe9c8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chunkupload
    ADD CONSTRAINT "FK_f22261008df274279a856bbe9c8" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: organisationsubscription FK_f323d107816658738ffc5f24e4f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisationsubscription
    ADD CONSTRAINT "FK_f323d107816658738ffc5f24e4f" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: order FK_f3e89e4f320e1913a5df44e73d8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_f3e89e4f320e1913a5df44e73d8" FOREIGN KEY (subscription) REFERENCES public.subscription(id);


--
-- Name: usergroupadmin FK_f4aac05cececb6992c4ce6edf86; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usergroupadmin
    ADD CONSTRAINT "FK_f4aac05cececb6992c4ce6edf86" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: messagingmessage FK_f9f4e03451ce3f15f25c824ea02; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messagingmessage
    ADD CONSTRAINT "FK_f9f4e03451ce3f15f25c824ea02" FOREIGN KEY (conversation) REFERENCES public.messagingconversation(id) ON DELETE CASCADE;


--
-- Name: roleuser FK_fc6a382c4c5f907688565e10fd0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roleuser
    ADD CONSTRAINT "FK_fc6a382c4c5f907688565e10fd0" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: token FK_fda0149ac8afd01fa8f8e6e02cb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token
    ADD CONSTRAINT "FK_fda0149ac8afd01fa8f8e6e02cb" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: media FK_fda6e313cfda165ee91ff61e0fb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT "FK_fda6e313cfda165ee91ff61e0fb" FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: questionaire FK_fdf5f2e28682092c349413236f3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionaire
    ADD CONSTRAINT "FK_fdf5f2e28682092c349413236f3" FOREIGN KEY ("additionalInfoDetailsId") REFERENCES public."KnightsAdditionalInfoDetails"(id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

