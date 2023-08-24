import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChartData, ChartOptions, DefaultDataPoint } from 'chart.js';
import { Response } from 'express';
import {
  Organisation,
  TransAtKPIListDTO,
} from 'src/auto-resources/organisation/organisation.entity';
import { LocalsService } from 'src/services/locals/locals.service';
import { getManager, Repository } from 'typeorm';
import { OrganisationContractor } from '../organisation-contractor/organisation-contractor.entity';
import {
  SafetyObservationCategory,
  SafetyObservationRiskLevel,
  SafetyObservationSubcategory,
} from '../safety-observations/safety-observations.entity';
import * as moment from 'moment-timezone';

type kpiReport = {
  displayName?: string;
  id: string;
  fnc: (...args: any[]) => Promise<kpiReturn>;
  isContractorReport?: boolean;
};

enum kpiReturnChartType {
  HORIZONTAL_BAR = 'HORIZONTAL_BAR',
  COUNTER = 'COUNTER',
  GAUGE = 'GAUGE',
  PIE = 'PIE',
  LINE = 'LINE',
  RADAR = 'RADAR',
  TRAFFIC_LIGHT = 'TRAFFIC_LIGHT',
}
export type gagueData = {
  label: string;
  count: number;
  min: number;
  max: number;
};

export type kpiReturn = {
  data: ChartData | gagueData[] | boolean;
  options: ChartOptions;
  type: kpiReturnChartType;
};

export type kpiGetReturn = {
  [displayname: string]: kpiReturn | [kpiGetReturn];
};

@Injectable()
export class KpiService {
  private readonly logger = new Logger(KpiService.name);

  private horizontalBarOptions = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
    },
  } as const;

  private lineGraphOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  } as const;

  constructor(
    @InjectRepository(OrganisationContractor)
    private organisationContractorRepo: Repository<OrganisationContractor>,
    @InjectRepository(Organisation)
    private organisationRepo: Repository<Organisation>,
    private localService: LocalsService,
  ) {}

  async LTIRProjectYearly(orgs: string[]): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `
		WITH years AS (
			SELECT generate_series(
							 (SELECT MIN("createdAt")::timestamp FROM "contractor-data-report"),
							 (select MAX("createdAt")::timestamp FROM "contractor-data-report"),
							 '1 year'::interval
						 ) AS year
		)
		SELECT
		  EXTRACT(YEAR FROM "years"."year") as yyyy,
			COALESCE(ROUND((CAST(SUM("contractor-data-report". "numLostTimeInjuries") as decimal) * organisation."kpiMultiplier") / NULLIF(SUM("contractor-data-report". "weeklyWorkedHours"), 0), 2), 0) AS count
		FROM
			"years"
		INNER JOIN "contractor-data-report" ON EXTRACT(YEAR FROM "contractor-data-report"."createdAt") = EXTRACT(YEAR from "years"."year")
		LEFT JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[])
			AND EXTRACT(YEAR FROM "contractor-data-report"."createdAt") < EXTRACT(YEAR FROM current_timestamp)
		GROUP BY yyyy, organisation."kpiMultiplier"
		ORDER BY yyyy desc
		`,
      [orgs],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.HORIZONTAL_BAR,
    };
  }

  async TRIRProjectYearly(orgs: string[]): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `
		with years as (
			select
				generate_series(
								 (
				select
					MIN("createdAt")::timestamp
				from
					"contractor-data-report"),
				(
				select
					MAX("createdAt")::timestamp
				from
					"contractor-data-report"),
				'1 year'::interval
							 ) as year
			)
			select
			  EXTRACT(YEAR FROM "years"."year") as yyyy,
				coalesce(ROUND(((
					cast(SUM("contractor-data-report". "numLostTimeInjuries") as decimal) +
					SUM("contractor-data-report". "numDeaths") +
					SUM("contractor-data-report". "numLossConciounessCases") +
						SUM("contractor-data-report". "numRestrictedWorkCase") +
						SUM("contractor-data-report". "medicalTreatmentInjuries")
					) * organisation. "kpiMultiplier") / nullif(SUM("contractor-data-report". "weeklyWorkedHours"),
				0),
				2),
				0) as count
			from
					"years"
			inner join "contractor-data-report" on
				extract(year
			from
				"contractor-data-report"."createdAt") = extract(year
			from
				"years"."year")
			left join organisation on
				"contractor-data-report".organisation = organisation.id
			where
					"contractor-data-report".organisation = any($1::uuid[])
          AND EXTRACT(YEAR FROM "contractor-data-report"."createdAt") < EXTRACT(YEAR FROM current_timestamp)
			group by
				yyyy,
				organisation."kpiMultiplier",
				organisation."TRIRMin",
				organisation."TRIRMax"
			order by
				yyyy desc	
	`,
      [orgs],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data: data,
      type: kpiReturnChartType.HORIZONTAL_BAR,
    };
  }

  async LTIRProjectMonthly(orgs: string[]): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		'data' as label,
			ROUND((cast(SUM("contractor-data-report". "numLostTimeInjuries") as decimal) * organisation."kpiMultiplier") / NULLIF(SUM("contractor-data-report". "weeklyWorkedHours"), 0), 2) AS count,
			organisation."LTIRMin" as min, 
			organisation."LTIRMax" as max
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[])
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY organisation."kpiMultiplier", min, max`,
      [orgs],
    )) as gagueData[];

    return {
      options: this.horizontalBarOptions,
      data: sqlData,
      type: kpiReturnChartType.GAUGE,
    };
  }

  async TRIRProjectMonthly(orgs: string[]): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		'data' as label,
		ROUND(((
			cast(SUM("contractor-data-report". "numLostTimeInjuries") as decimal) +
			SUM("contractor-data-report". "numDeaths") +
			SUM("contractor-data-report". "numLossConciounessCases") +
			SUM("contractor-data-report". "numRestrictedWorkCase") +
			SUM("contractor-data-report". "medicalTreatmentInjuries")
		) * organisation. "kpiMultiplier") / NULLIF(SUM("contractor-data-report". "weeklyWorkedHours"), 0), 2) AS count,
		organisation."TRIRMin" as min, 
		organisation."TRIRMax" as max
	FROM
		"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
	WHERE
		"contractor-data-report".organisation = ANY($1::uuid[])
		AND "contractor-data-report"."createdAt" > NOW() - interval '1 year'
	GROUP BY organisation."kpiMultiplier", organisation."TRIRMin", organisation."TRIRMax"`,
      [orgs],
    )) as gagueData[];

    return {
      options: this.horizontalBarOptions,
      data: sqlData,
      type: kpiReturnChartType.GAUGE,
    };
  }

  async safetyobservationsOpenRiskLevel(orgs: string[]) {
    const sqlData = (await getManager().query(
      `SELECT
		COUNT(*) FILTER (WHERE "safety-observations" . "riskLevel" = 'High') AS high,
		COUNT(*) FILTER (WHERE "safety-observations" . "riskLevel" = 'Medium') AS medium, 
		COUNT(*) FILTER (WHERE "safety-observations" . "riskLevel" = 'Low') AS low, 
		COUNT(*) FILTER (WHERE "safety-observations" . "riskLevel" = 'Good Practice') AS gp
		FROM
			"safety-observations"
		WHERE
			"safety-observations".organisation = ANY($1::uuid[])`,
      [orgs],
    )) as [{ high: number; medium: number; low: number; gp: number }];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: [
        SafetyObservationRiskLevel.HIGH,
        SafetyObservationRiskLevel.MEDIUM,
        SafetyObservationRiskLevel.LOW,
        SafetyObservationRiskLevel.GOOD_PRACTICE,
      ],
      datasets: [
        {
          data: sqlData.length
            ? [
                sqlData[0].high,
                sqlData[0].medium,
                sqlData[0].low,
                sqlData[0].gp,
              ]
            : [0, 0, 0, 0],
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async safetyobservationsOpenCategory(orgs: string[]) {
    const sqlData = (await getManager().query(
      `SELECT
		COUNT(*) FILTER (WHERE "safety-observations" . "category" = 'Physical Risk') AS physical,
		COUNT(*) FILTER (WHERE "safety-observations" . "category" = 'Biological Risk') AS bio, 
		COUNT(*) FILTER (WHERE "safety-observations" . "category" = 'Chemical Risk') AS chem, 
		COUNT(*) FILTER (WHERE "safety-observations" . "category" = 'Physiological Risk') AS physiological
		FROM
			"safety-observations"
		WHERE
		"safety-observations".organisation = ANY($1::uuid[])`,
      [orgs],
    )) as [
      { physical: number; bio: number; chem: number; physiological: number },
    ];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: [
        SafetyObservationCategory.PHYSICAL_RISK,
        SafetyObservationCategory.BIOLOGICAL_RISK,
        SafetyObservationCategory.CHEMICAL_RISK,
        SafetyObservationCategory.PHYSIOLOGICAL_RISK,
      ],
      datasets: [
        {
          data: sqlData.length
            ? [
                sqlData[0].physical,
                sqlData[0].bio,
                sqlData[0].chem,
                sqlData[0].physiological,
              ]
            : [0, 0, 0, 0],
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async safetyobservationsOpenSubCategory(orgs: string[]) {
    const getCount = () => {
      const ret = [];

      for (const sub of Object.values(SafetyObservationSubcategory)) {
        ret.push(`COUNT(*) FILTER (WHERE subcategory = '${sub}') AS "${sub}"`);
      }

      return ret.join(',');
    };

    const sqlData = await getManager().query(
      `SELECT
		${getCount()}		
		FROM
			"safety-observations"
		WHERE
		"safety-observations".organisation = ANY($1::uuid[])`,
      [orgs],
    );

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: Object.values(SafetyObservationSubcategory),
      datasets: [
        {
          data: Object.values(sqlData[0]),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async safetyobservationsOpenClosed(orgs: string[]) {
    const sqlData = (await getManager().query(
      `SELECT
		COUNT(*) FILTER (WHERE "closingSignature" IS NULL) AS open,
		COUNT(*) FILTER (WHERE "closingSignature" IS NOT NULL) AS closed
		FROM
			"safety-observations"
		WHERE
		"safety-observations".organisation = ANY($1::uuid[])`,
      [orgs],
    )) as [{ open: number; closed: number }];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: ['Open', 'Closed'],
      datasets: [
        {
          data: sqlData.length ? [sqlData[0].open, sqlData[0].closed] : [0, 0],
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async nearMissIncidentRate(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
        extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
        ROUND((
          (
            cast(SUM("contractor-data-report". "numNearMisses") as decimal)
          ) 
        ) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * organisation. "kpiMultiplier", 2) AS count
        FROM
        "contractor-data-report"
        INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
        WHERE
        "contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
        GROUP BY yyyy, organisation.id, organisation. "kpiMultiplier"
        ORDER BY yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.HORIZONTAL_BAR,
    };
  }

  async RIDDORRateYearly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
		(
			(
				SUM("contractor-data-report". "numRIDDOROccupationalIllnesses") +
				SUM("contractor-data-report". "numRIDDOR7DayInjuries") +
				SUM("contractor-data-report". "numRIDDORSpecifiedInjuries") +
				SUM("contractor-data-report". "numRIDDORDangerousOccurrences")
			) 
		) AS count
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY yyyy, organisation.id`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'line', DefaultDataPoint<'line'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.lineGraphOptions,
      data,
      type: kpiReturnChartType.LINE,
    };
  }

  async RIDDORSpecifiedInjuryRateYearly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
		ROUND((
			(
				cast(SUM("contractor-data-report". "numRIDDORSpecifiedInjuries") as decimal)
			) 
		) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 1000000, 2) AS count
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY yyyy, organisation.id
ORDER BY yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDORDangerousOccurrencesYearly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
		ROUND((
			(
				cast(SUM("contractor-data-report". "numRIDDORDangerousOccurrences") as decimal)
			) 
		) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 1000000, 2) AS count
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY yyyy, organisation.id
ORDER BY yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDOROccupationalIllnessYearly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
		ROUND((
			(
				cast(SUM("contractor-data-report". "numRIDDOROccupationalIllnesses") as decimal)
			) 
		) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 1000000, 2) AS count
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY yyyy, organisation.id
ORDER BY yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDOR3DayInjuryYearly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
		ROUND((
			(
				cast(SUM("contractor-data-report". "numRIDDOR3DayInjuries") as decimal)
			) 
		) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 1000000, 2) AS count
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY yyyy, organisation.id
ORDER BY yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDOR7DayInjuryYearly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
		ROUND((
			(
				cast(SUM("contractor-data-report". "numRIDDOR7DayInjuries") as decimal)
			) 
		) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 1000000, 2) AS count
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY yyyy, organisation.id
ORDER BY yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async OSHAEventsYearly(orgs: string[]) {
    const sqlData = (await getManager().query(
      `
		WITH years AS (
			SELECT
				generate_series((
					SELECT
						MIN("createdAt")::timestamp FROM "contractor-data-report"),
					(
						SELECT
							MAX("createdAt")::timestamp FROM "contractor-data-report"),
						'1 year'::interval) AS year
		)
		SELECT
			EXTRACT(YEAR FROM "years"."year") AS yyyy,
			coalesce(ROUND(((cast(SUM("contractor-data-report"."numOSHARecordableInjuries") AS decimal))) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 1000000, 2), 0) AS count
		FROM
			"years"
			INNER JOIN "contractor-data-report" ON EXTRACT(YEAR FROM "contractor-data-report"."createdAt") = EXTRACT(YEAR FROM "years"."year")
			LEFT JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY ($1::uuid [])
		GROUP BY
			yyyy,
			organisation.id
		ORDER BY
			yyyy
`,
      [orgs],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async OSHADARTRate(orgs: string[], startDateISO: string, endDateISO: string) {
    const sqlData = (await getManager().query(
      `SELECT
		organisation. "name" as label,
		ROUND(cast(SUM("contractor-data-report"."numRestrictedWorkCase") as decimal) + 
      cast(SUM("contractor-data-report"."numOSHAJobTransferCases") as decimal)
     * 200000 / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0), 2) AS count,
		organisation. "DARTMin" as min,
		organisation. "DARTMax" as max
	FROM
		"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
	WHERE
		"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
	GROUP BY
		organisation. "id", organisation. "name", organisation. "DARTMin", organisation. "DARTMax"`,
      [orgs, startDateISO, endDateISO],
    )) as gagueData;

    return {
      options: {},
      data: sqlData,
      type: kpiReturnChartType.GAUGE,
    };
  }

  async processSafetyTierEvents(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		ROUND(cast(SUM("contractor-data-report"."numTier1PSECount") as decimal) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 200000, 2) AS tier1events, 
		ROUND(cast(SUM("contractor-data-report"."numTier2PSECount") as decimal) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 200000, 2) AS tier2events, 
		ROUND(cast(SUM("contractor-data-report"."numTier3PSECount") as decimal) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 200000, 2) AS tier3events,
		SUM("contractor-data-report"."numTier1PSECount") AS tier1eventscount, 
		SUM("contractor-data-report"."numTier2PSECount") AS tier2eventscount, 
		SUM("contractor-data-report"."numTier3PSECount") AS tier3eventscount	
FROM
"contractor-data-report"
INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY 
organisation.id`,
      [orgs, startDateISO, endDateISO],
    )) as [
      {
        tier1events: number;
        tier2events: number;
        tier3events: number;
        tier1eventscount: number;
        tier2eventscount: number;
        tier3eventscount: number;
      },
    ];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: [
        `Process Safety Tier 1 Events: ${
          sqlData[0]?.tier1eventscount ? sqlData[0]?.tier1eventscount : 0
        }`,
        `Process Safety Tier 2 Events: ${
          sqlData[0]?.tier2eventscount ? sqlData[0]?.tier2eventscount : 0
        }`,
        `Process Safety Tier 3 Events: ${
          sqlData[0]?.tier3eventscount ? sqlData[0]?.tier3eventscount : 0
        }`,
      ],
      datasets: [
        {
          data: sqlData.length
            ? [
                sqlData[0].tier1events,
                sqlData[0].tier2events,
                sqlData[0].tier3events,
              ]
            : [0, 0, 0],
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async processSafetyTier1Event(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		ROUND(cast(SUM("contractor-data-report"."numTier1PSECount") as decimal) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 200000, 2) AS tier1events, 
		ROUND((
	cast(SUM("contractor-data-report"."numTier2PSECount") as decimal) +
	SUM("contractor-data-report"."numProcessSafetyTier3Events")
) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0)  * 200000, 2) AS other
FROM
"contractor-data-report"
INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY 
organisation.id`,
      [orgs, startDateISO, endDateISO],
    )) as [{ tier1events: number; other: number }];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: ['Process Safety Tier 1 Events', 'Other'],
      datasets: [
        {
          data: sqlData.length
            ? [sqlData[0].tier1events, sqlData[0].other]
            : [0, 0],
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async processSafetyTier2Event(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		ROUND(cast(SUM("contractor-data-report"."numTier2PSECount") as decimal) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 200000, 2) AS tier2events, 
		ROUND((
	cast(SUM("contractor-data-report"."numTier1PSECount") as decimal) +
	SUM("contractor-data-report"."numProcessSafetyTier3Events")
) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 200000, 2) AS other
FROM
"contractor-data-report"
INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY 
organisation.id`,
      [orgs, startDateISO, endDateISO],
    )) as [{ tier2events: number; other: number }];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: ['Process Safety Tier 2 Events', 'Other'],
      datasets: [
        {
          data: sqlData.length
            ? [sqlData[0].tier2events, sqlData[0].other]
            : [0, 0],
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async processSafetyTier3Event(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		ROUND(cast(SUM("contractor-data-report"."numProcessSafetyTier3Events") as decimal) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0) * 200000, 2) AS tier3events, 
		ROUND((
	cast(SUM("contractor-data-report"."numTier1PSECount") as decimal) +
	SUM("contractor-data-report"."numTier2PSECount")
) / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0)  * 200000, 2) AS other
FROM
"contractor-data-report"
INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY 
organisation.id`,
      [orgs, startDateISO, endDateISO],
    )) as [{ tier3events: number; other: number }];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: ['Process Safety Tier 3 Events', 'Other'],
      datasets: [
        {
          data: sqlData.length
            ? [sqlData[0].tier3events, sqlData[0].other]
            : [0, 0],
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async numOfWorkersInTotalLG(orgs: string[]) {
    const sqlData = (await getManager().query(
      `SELECT
    TO_CHAR(date_trunc('month', "contractor-data-report"."createdAt"), 'Month') AS mm,
    ROUND(AVG("contractor-data-report"."numOfWorkers"), 2) AS count
FROM
    "contractor-data-report"
INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
    "contractor-data-report".organisation = ANY($1::uuid[])
    AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY
    TO_CHAR(date_trunc('month', "contractor-data-report"."createdAt"), 'Month')
ORDER BY
    MIN(date_trunc('month', "contractor-data-report"."createdAt"));`,
      [
        orgs,
        moment().tz('Europe/London').subtract(1, 'year').format(),
        moment().tz('Europe/London').format(),
      ],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'line', DefaultDataPoint<'line'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.lineGraphOptions,
      data,
      type: kpiReturnChartType.LINE,
    };
  }

  async numOfJobTransferCases(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numOSHAJobTransferCases") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Job Transfer Cases'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfJobTransferDays(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numOSHAJobTransferDays") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Job Transfer Days'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async workedHoursPerMonth(orgs: string[]) {
    const sqlData = (await getManager().query(
      `SELECT
    TO_CHAR(date_trunc('month', "contractor-data-report"."createdAt"), 'Month') AS mm,
    SUM("contractor-data-report"."weeklyWorkedHours") AS count
FROM
    "contractor-data-report"
INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
    "contractor-data-report".organisation = ANY($1::uuid[])
    AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY
    TO_CHAR(date_trunc('month', "contractor-data-report"."createdAt"), 'Month')
ORDER BY
    MIN(date_trunc('month', "contractor-data-report"."createdAt"));`,
      [
        orgs,
        moment().tz('Europe/London').subtract(1, 'year').format(),
        moment().tz('Europe/London').format(),
      ],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'line', DefaultDataPoint<'line'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.lineGraphOptions,
      data,
      type: kpiReturnChartType.LINE,
    };
  }

  async lostHoursPerMonth(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("lost-time-report"."createdAt", 'Month') as mm,
	(
		SUM("lost-time-report". "numLostHoursPerWeekRain") +
		SUM("lost-time-report". "numLostHoursPerWeekStorm") +
		SUM("lost-time-report". "numLostHoursPerWeekHighWinds") +
		SUM("lost-time-report". "numLostHoursPerWeekHeatColdStressManagement") +
		SUM("lost-time-report". "numLostHoursPerWeekCOVID19") +
		SUM("lost-time-report". "numLostHoursPerWeekPowerCutsAndInterruptions") +
		SUM("lost-time-report". "numLostHoursPerWeekUnionStoppages") +
		SUM("lost-time-report". "numLostHoursPerWeekPermitToWorkAuthorizations") +
		SUM("lost-time-report". "numLostHoursPerWeekPlantStoppages")
	) AS count 
	FROM
	"lost-time-report"
	INNER JOIN organisation ON "lost-time-report".organisation = organisation.id
WHERE
	"lost-time-report".organisation = ANY($1::uuid[]) AND "lost-time-report"."createdAt" BETWEEN $2 AND $3
GROUP BY
	mm
ORDER BY
	mm`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'pie', DefaultDataPoint<'pie'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.PIE,
    };
  }

  async numOfWorkersInTotalYearly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	extract(year FROM "contractor-data-report". "createdAt") AS yyyy,
	SUM("contractor-data-report". "weeklyWorkedHours") as count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
GROUP BY
	yyyy
ORDER BY
	yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.HORIZONTAL_BAR,
    };
  }

  async numOfWorkedHours(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "weeklyWorkedHours") as count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 AND 
	"contractor-data-report"."createdAt" BETWEEN $2 AND $3
`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['Worked Hours'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async workedHoursPerWithObservationsMonth(orgs: string[]) {
    const sqlData = (await getManager().query(
      `SELECT
    TO_CHAR(cdr_monthly."createdat", 'Month') AS mm,
    SUM(cdr_monthly."weeklyWorkedHours") AS hoursCount,
    obs_monthly.count AS safetyCount
FROM (
    SELECT
        DATE_TRUNC('month', "createdAt") AS createdAt,
        "weeklyWorkedHours",
        "organisation"
    FROM
        "contractor-data-report"
    WHERE
        "contractor-data-report".organisation = ANY($1::uuid[]) 
) cdr_monthly
INNER JOIN organisation ON cdr_monthly.organisation = organisation.id
LEFT JOIN (
    SELECT
        DATE_TRUNC('month', "createdAt") AS createdAt,
        COUNT(*) AS count
    FROM
        "safety-observations"
    WHERE
        "safety-observations".organisation = ANY($1::uuid[]) 
        AND "safety-observations"."createdAt" BETWEEN $2 AND $3
    GROUP BY
        DATE_TRUNC('month', "createdAt")
) obs_monthly ON obs_monthly.createdAt = cdr_monthly.createdAt
GROUP BY
    TO_CHAR(cdr_monthly."createdat", 'Month'),
    obs_monthly.count
ORDER BY
    MIN(cdr_monthly.createdAt);
`,
      [
        orgs,
        moment().tz('Europe/London').subtract(1, 'year').format(),
        moment().tz('Europe/London').format(),
      ],
    )) as [{ mm: string; hourscount: number; safetycount: number }];

    const data = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          type: 'line' as const,
          label: 'Hours worked',
          data: sqlData.map((x) => x.hourscount),
        },
        {
          type: 'bar' as const,
          label: 'Safety Observations',
          data: sqlData.map((x) => x.safetycount),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.HORIZONTAL_BAR,
    };
  }

  async workersOnSiteAccidentsPerMonth(orgs: string[]) {
    const sqlData = (await getManager().query(
      `SELECT
    TO_CHAR(cdr_monthly."createdat", 'Month') as mm,
    SUM(cdr_monthly."numOfWorkers") AS workerCount,
        SUM("numNearMisses") +
        SUM("numOfPropertyDamagedEvents") +
        SUM("numFirstAidInjuries") +
        SUM("medicalTreatmentInjuries") +
        SUM("numOSHAJobTransferCases") +
        SUM("numOSHAJobTransferDays") +
        SUM("numLossConciounessCases") +
        SUM("numLostTimeInjuries") +
        SUM("numDeaths") +
        SUM("numRIDDOROccupationalIllnesses") +
        SUM("numRIDDOR7DayInjuries") +
        SUM("numRIDDORSpecifiedInjuries") +
        SUM("numRIDDORDangerousOccurrences") as accidents
FROM (
    SELECT
        DATE_TRUNC('month', "createdAt") AS createdAt,
        "numOfWorkers",
        "numNearMisses",
        "numOfPropertyDamagedEvents",
        "numFirstAidInjuries",
        "medicalTreatmentInjuries",
        "numOSHAJobTransferCases",
        "numOSHAJobTransferDays",
        "numLossConciounessCases",
        "numLostTimeInjuries",
        "numDeaths",
        "numRIDDOROccupationalIllnesses",
        "numRIDDOR7DayInjuries",
        "numRIDDORSpecifiedInjuries",
        "numRIDDORDangerousOccurrences",
        "organisation"
    FROM
        "contractor-data-report"
    WHERE
        "contractor-data-report".organisation = ANY($1::uuid[]) 
        AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
) cdr_monthly
INNER JOIN organisation ON cdr_monthly.organisation = organisation.id
GROUP BY
    TO_CHAR(cdr_monthly."createdat", 'Month')
ORDER BY
    MIN(cdr_monthly.createdAt);`,
      [
        orgs,
        moment().tz('Europe/London').subtract(1, 'year').format(),
        moment().tz('Europe/London').format(),
      ],
    )) as [{ mm: string; workercount: number; accidents: number }];

    const data = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          type: 'line' as const,
          label: 'Worker Count',
          data: sqlData.map((x) => x.workercount),
        },
        {
          type: 'bar' as const,
          label: 'Accidents',
          data: sqlData.map((x) => x.accidents),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.HORIZONTAL_BAR,
    };
  }

  async numOfFirstAidInjuries(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numFirstAidInjuries") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# First Aid Injuries'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfLossCons(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numLossConciounessCases") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Loss of Consciousness Cases'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfRIDDORSpecifiedInjuries(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numRIDDORSpecifiedInjuries") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# RIDDOR Specified Injuries'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfRIDDORMajorInjuries(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numRIDDORMajorInjuries") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# RIDDOR Major Injuries'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfRIDDOREventsPerYear(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		extract(year from "contractor-data-report"."createdAt") as yyyy,
	(
		SUM("contractor-data-report". "numRIDDOROccupationalIllnesses") +
		SUM("contractor-data-report". "numRIDDOR7DayInjuries") +
		SUM("contractor-data-report". "numRIDDOR3DayInjuries") +
		SUM("contractor-data-report". "numRIDDORSpecifiedInjuries") +
		SUM("contractor-data-report". "numRIDDORDangerousOccurrences")
	) AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3
	GROUP BY
	yyyy
ORDER BY
	yyyy`,
      [orgs, startDateISO, endDateISO],
    )) as [{ yyyy: string; count: number }];

    const data: ChartData<'line', DefaultDataPoint<'line'>, unknown> = {
      labels: sqlData.map((x) => x.yyyy),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.lineGraphOptions,
      data,
      type: kpiReturnChartType.LINE,
    };
  }

  async numRIDDOROccupationalIllness(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numRIDDOROccupationalIllnesses") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# RIDDOR Occuptional Illness Cases'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfRIDDORDangOccurrences(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numRIDDORDangerousOccurrences") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# RIDDOR Dangerous Occurences'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfDeaths(orgs: string[], startDateISO: string, endDateISO: string) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numDeaths") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Fatality Cases'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async propertyDamageEvents(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
SUM("contractor-data-report". "numOfPropertyDamagedEvents") AS count 
FROM
"contractor-data-report"
INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Property Damage Events'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfNearMisses(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numNearMisses") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Near Misses'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfMedicalTreatmentInjuries(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "medicalTreatmentInjuries") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Medical Treatment Injuries'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfTimeInjuries(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report". "numLostTimeInjuries") AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# Lost Time Injury Cases'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfRiddorCases(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		( SUM("contractor-data-report". "numRIDDOROccupationalIllnesses") +
		SUM("contractor-data-report". "numRIDDOR7DayInjuries") +
		SUM("contractor-data-report". "numRIDDORSpecifiedInjuries") +
		SUM("contractor-data-report". "numRIDDORDangerousOccurrences") ) AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['Total # RIDDOR Cases'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numRIDDOR3DayInjuries(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		SUM("contractor-data-report". "numRIDDOR3DayInjuries")  AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# 3-day RIDDOR Injuries'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numRIDDOR7DayInjuries(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		SUM("contractor-data-report". "numRIDDOR7DayInjuries")  AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# 7-day RIDDOR Injuries'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async numOfRIDDOROccupationalIllness(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		SUM("contractor-data-report". "numRIDDOROccupationalIllnesses")  AS count 
	FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: ['# RIDDOR Occuptional Illness Cases'],
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async RIDDORRate(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY') AS mm,
			ROUND(((
				CAST(SUM("contractor-data-report". "numRIDDOROccupationalIllnesses") as decimal) +
				SUM("contractor-data-report". "numRIDDOR7DayInjuries") +
				SUM("contractor-data-report". "numRIDDORMajorInjuries") +
				SUM("contractor-data-report". "numRIDDORSpecifiedInjuries") +
				SUM("contractor-data-report". "numRIDDORDangerousOccurrences")
			) * 100000) / NULLIF(AVG("contractor-data-report". "numOfWorkers"), 0), 2) AS count
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY mm
		ORDER BY TO_DATE(TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY'), 'Month YYYY')`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDORSpecifiedInjuryMonthly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY') AS mm,
			ROUND((
				cast(SUM("contractor-data-report". "numRIDDORSpecifiedInjuries") as decimal)
			) * 100000 / NULLIF(AVG("contractor-data-report". "numOfWorkers"), 0), 2) AS count
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY mm
		ORDER BY TO_DATE(TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY'), 'Month YYYY')`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDORDangerousOccurrencesMonthly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY') AS mm,
			ROUND((
				cast(SUM("contractor-data-report". "numRIDDORDangerousOccurrences") as decimal)
			) * 100000 / NULLIF(AVG("contractor-data-report". "numOfWorkers"), 0), 2) AS count
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY mm
		ORDER BY TO_DATE(TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY'), 'Month YYYY')`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDORMajorInjuriesMonthly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY') AS mm,
			ROUND((
				cast(SUM("contractor-data-report". "numRIDDORMajorInjuries") as decimal)
			) * 100000 / NULLIF(AVG("contractor-data-report". "numOfWorkers"), 0), 2) AS count
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY mm
		ORDER BY TO_DATE(TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY'), 'Month YYYY')`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDOROccupationalIllnessMonthly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY') AS mm,
			ROUND((
				cast(SUM("contractor-data-report". "numRIDDOROccupationalIllnesses") as decimal)
			) * 100000 / NULLIF(AVG("contractor-data-report". "numOfWorkers"), 0), 2) AS count
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY mm
		ORDER BY TO_DATE(TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY'), 'Month YYYY')`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDORRiddor3DayInjuryMonthly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY') AS mm,
			ROUND((
				cast(SUM("contractor-data-report". "numRIDDOR3DayInjuries") as decimal)
			) * 100000 / NULLIF(AVG("contractor-data-report". "numOfWorkers"), 0), 2) AS count
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY mm
		ORDER BY TO_DATE(TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY'), 'Month YYYY')`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async RIDDORRiddor7DayInjuryMonthly(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY') AS mm,
			ROUND((
				cast(SUM("contractor-data-report". "numRIDDOR7DayInjuries") as decimal)
			) * 100000 / NULLIF(AVG("contractor-data-report". "numOfWorkers"), 0), 2) AS count
		FROM
			"contractor-data-report"
		INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $2 AND $3 
			AND
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY mm
		ORDER BY TO_DATE(TO_CHAR("contractor-data-report"."createdAt", 'Month YYYY'), 'Month YYYY')`,
      [orgs, startDateISO, endDateISO],
    )) as [{ mm: string; count: number }];

    const data: ChartData<'radar', DefaultDataPoint<'radar'>, unknown> = {
      labels: sqlData.map((x) => x.mm),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.RADAR,
    };
  }

  async contractorHours(
    orgs: string[],
    contractors: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
	SUM("contractor-data-report"."weeklyWorkedHours")  as count, "contractor-data-report"."contractorId", organisationcontractor."name"
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
	INNER JOIN organisationcontractor ON "contractor-data-report"."contractorId" = organisationcontractor.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND 
	organisationcontractor.id = ANY($2::uuid[]) AND
	"contractor-data-report"."createdAt" BETWEEN $3 AND $4
GROUP BY
	"contractor-data-report"."contractorId", organisationcontractor."name"`,
      [orgs, contractors, startDateISO, endDateISO],
    )) as [{ count: number; name: string }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.name),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: {},
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async contractorNumberOfWorks(
    orgs: string[],
    contractors: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		TO_CHAR("contractor-data-report"."createdAt", 'Month') as mm,
	SUM("contractor-data-report"."numOfWorkers")  as count,
	"contractor-data-report"."contractorId",
	organisationcontractor."name"
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
	INNER JOIN organisationcontractor ON "contractor-data-report"."contractorId" = organisationcontractor.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $3 AND $4 
	AND 
	organisationcontractor.id = ANY($2::uuid[])
	AND
	"contractor-data-report"."createdAt" > NOW() - interval '1 year'
GROUP BY
	mm, "contractor-data-report"."contractorId", organisationcontractor."name"`,
      [orgs, contractors, startDateISO, endDateISO],
    )) as [{ mm: string; count: number; id: string; name: string }];
    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.name),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async contractorNumberOfHoursLost(
    orgs: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		( 
			SUM( "lost-time-report"."numLostHoursPerWeekRain" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekStorm" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekHighWinds" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekHeatColdStressManagement" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekCOVID19" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekPowerCutsAndInterruptions" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekUnionStoppages" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekPermitToWorkAuthorizations" ) +
			SUM( "lost-time-report"."numLostHoursPerWeekPlantStoppages" ) 
		) as count, organisationcontractor."name"
	FROM
		"lost-time-report"
		INNER JOIN organisation ON "lost-time-report".organisation = organisation.id
		INNER JOIN organisationcontractor ON "lost-time-report"."contractorId" = organisationcontractor.id
	WHERE
		"lost-time-report".organisation = ANY($1::uuid[]) AND 
		"lost-time-report"."createdAt" BETWEEN $2 AND $3
	GROUP BY
		"lost-time-report"."contractorId", organisationcontractor."name"`,
      [orgs, startDateISO, endDateISO],
    )) as [{ count: number; name: string }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.name),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.HORIZONTAL_BAR,
    };
  }

  async contractorNumberOfOpenObservations(
    orgs: string[],
    contractors: string[],
    startDateISO: string,
    endDateISO: string,
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		organisationcontractor."name" as name, COUNT(DISTINCT "safety-observations".id) 
	FROM
		"safety-observations"
	INNER JOIN organisationcontractor ON "safety-observations"."contractorId" = organisationcontractor.id
	WHERE
		"safety-observations".organisation = ANY($1::uuid[])
		AND "safety-observations"."createdAt" BETWEEN $3 AND $4
		AND 
		"safety-observations"."contractorId" = ANY($2::uuid[])
		AND
		"safety-observations"."closingSignature" IS NULL	
	GROUP BY
		 organisationcontractor."name"`,
      [orgs, contractors, startDateISO, endDateISO],
    )) as [{ name: string; count: number }];
    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.name),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  // Start Date and End Date are ignored here
  async contractorTrafficLight(
    orgs: string[],
    contractors: string[],
  ): Promise<kpiReturn> {
    const sqlData = (await getManager().query(
      `SELECT
		organisationcontractor."name", COUNT(*) as count 
FROM
	"contractor-data-report"
	INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
	INNER JOIN organisationcontractor ON "contractor-data-report"."contractorId" = organisationcontractor.id
WHERE
	"contractor-data-report".organisation = ANY($1::uuid[])
	AND 
	organisationcontractor.id = ANY($2::uuid[])
	AND
	"contractor-data-report"."createdAt" BETWEEN $3 AND $4
GROUP BY
	"contractor-data-report"."contractorId", organisationcontractor."name"`,
      [
        orgs,
        contractors,
        moment().tz('Europe/London').startOf('isoWeek').format(),
        moment().tz('Europe/London').endOf('isoWeek').format(),
      ],
    )) as [{ name: string; count: number }];

    return {
      options: null,
      data: !!sqlData[0]?.count,
      type: kpiReturnChartType.TRAFFIC_LIGHT,
    };
  }

  async contractorLTIRRate(
    orgs: string[],
    contractors: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		ROUND(cast(SUM("contractor-data-report"."numLostTimeInjuries") as decimal) * organisation."kpiMultiplier" / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0), 2)  as count, "contractor-data-report"."contractorId", organisationcontractor."name"
		FROM
			"contractor-data-report"
			INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
			INNER JOIN organisationcontractor ON "contractor-data-report"."contractorId" = organisationcontractor.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $3 AND $4 
			AND 
			organisationcontractor.id = ANY($2::uuid[])
			AND 
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY
			organisation."kpiMultiplier", "contractor-data-report"."contractorId", organisationcontractor."name"`,
      [orgs, contractors, startDateISO, endDateISO],
    )) as [{ name: string; count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.name),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  async contractorTRIRRate(
    orgs: string[],
    contractors: string[],
    startDateISO: string,
    endDateISO: string,
  ) {
    const sqlData = (await getManager().query(
      `SELECT
		ROUND((
			cast(SUM("contractor-data-report". "numLostTimeInjuries") as decimal) +
			SUM("contractor-data-report". "numDeaths") +
			SUM("contractor-data-report". "numLossConciounessCases") +
			SUM("contractor-data-report". "numRestrictedWorkCase") +
			SUM("contractor-data-report". "medicalTreatmentInjuries")
		) * organisation."kpiMultiplier" / NULLIF(SUM("contractor-data-report"."weeklyWorkedHours"), 0), 2)  as count, "contractor-data-report"."contractorId", organisationcontractor."name"
		FROM
			"contractor-data-report"
			INNER JOIN organisation ON "contractor-data-report".organisation = organisation.id
			INNER JOIN organisationcontractor ON "contractor-data-report"."contractorId" = organisationcontractor.id
		WHERE
			"contractor-data-report".organisation = ANY($1::uuid[]) AND "contractor-data-report"."createdAt" BETWEEN $3 AND $4 
			AND 
			organisationcontractor.id = ANY($2::uuid[])
			AND 
			"contractor-data-report"."createdAt" > NOW() - interval '1 year'
		GROUP BY
			organisation."kpiMultiplier", "contractor-data-report"."contractorId", organisationcontractor."name"`,
      [orgs, contractors, startDateISO, endDateISO],
    )) as [{ name: string; count: number }];

    const data: ChartData<'bar', DefaultDataPoint<'bar'>, unknown> = {
      labels: sqlData.map((x) => x.name),
      datasets: [
        {
          data: sqlData.map((x) => x.count),
        },
      ],
    };

    return {
      options: this.horizontalBarOptions,
      data,
      type: kpiReturnChartType.COUNTER,
    };
  }

  reportList = <kpiReport[]>[
    {
      displayName: 'LTIR Comparison Per Year',
      id: 'LTIRProjectYearly',
      fnc: this.LTIRProjectYearly,
    },
    {
      displayName: 'TRIR Comparison Per Year',
      id: 'TRIRProjectYearly',
      fnc: this.TRIRProjectYearly,
    },
    {
      displayName: 'LTIR (12-month cycle)',
      id: 'LTIRProjectMonthly',
      fnc: this.LTIRProjectMonthly,
    },
    {
      displayName: 'TRIR (12-month cycle)',
      id: 'TRIRProjectMonthly',
      fnc: this.TRIRProjectMonthly,
    },

    // Safety obs
    {
      displayName: 'Risk',
      id: 'safetyobservationsOpenRiskLevel',
      fnc: this.safetyobservationsOpenRiskLevel,
    },
    {
      displayName: 'Category',
      id: 'safetyobservationsOpenCategory',
      fnc: this.safetyobservationsOpenCategory,
    },
    {
      displayName: 'Sub Category',
      id: 'safetyobservationsOpenSubCategory',
      fnc: this.safetyobservationsOpenSubCategory,
    },
    {
      displayName: 'Total Open vs Closed',
      id: 'safetyobservationsOpenClosed',
      fnc: this.safetyobservationsOpenClosed,
    },

    // Safety Events
    {
      displayName: 'Process Safety Events',
      id: 'processSafetyTierEvents',
      fnc: this.processSafetyTierEvents,
    },

    // jobs
    {
      displayName: '# Restricted Work / Job Transfer Cases',
      id: 'numOfJobTransferCases',
      fnc: this.numOfJobTransferCases,
    },
    {
      displayName: '# Job Transfer Days',
      id: 'numOfJobTransferDays',
      fnc: this.numOfJobTransferDays,
    },

    // Hours and workers
    {
      displayName: '# Workers',
      id: 'numOfWorkersInTotalLG',
      fnc: this.numOfWorkersInTotalLG,
    },
    {
      displayName: 'Total Worked Hours (Entire Project)',
      id: 'workedHoursPerMonth',
      fnc: this.workedHoursPerMonth,
    },
    {
      displayName: '# Lost Hours / Month',
      id: 'lostHoursPerMonth',
      fnc: this.lostHoursPerMonth,
    },
    {
      displayName: '# Worked Hours / Year',
      id: 'numOfWorkersInTotalYearly',
      fnc: this.numOfWorkersInTotalYearly,
    },
    {
      displayName: '# Worked Hours vs # Observations',
      id: 'workedHoursPerWithObservationsMonth',
      fnc: this.workedHoursPerWithObservationsMonth,
    },
    {
      displayName: '# Workers on Site vs # of Accidents',
      id: 'workersOnSiteAccidentsPerMonth',
      fnc: this.workersOnSiteAccidentsPerMonth,
    },
    {
      displayName: 'Hours Worked / Month',
      id: 'numOfWorkeredHours',
      fnc: this.numOfWorkedHours,
    },
    {
      displayName: '# Hours Lost by Contractor',
      id: 'contractorNumberOfHoursLost',
      fnc: this.contractorNumberOfHoursLost,
    },

    // Injuries
    {
      displayName: '# First Aid Injuries',
      id: 'numOfFirstAidInjuries',
      fnc: this.numOfFirstAidInjuries,
    },
    {
      displayName: '# Loss of Consciousness Cases',
      id: 'numOfLossCons',
      fnc: this.numOfLossCons,
    },
    {
      displayName: '# Fatality Cases',
      id: 'numOfDeaths',
      fnc: this.numOfDeaths,
    },
    {
      displayName: '# Near Misses',
      id: 'numOfNearMisses',
      fnc: this.numOfNearMisses,
    },
    {
      displayName: '# Property Damage Events',
      id: 'propertyDamageEvents',
      fnc: this.propertyDamageEvents,
    },
    {
      displayName: '# Medical Treatment Injuries',
      id: 'numOfMedicalTreatmentInjuries',
      fnc: this.numOfMedicalTreatmentInjuries,
    },
    {
      displayName: '# Lost Time Injury Cases',
      id: 'numOfTimeInjuries',
      fnc: this.numOfTimeInjuries,
    },
    {
      displayName: '# 7-day RIDDOR Injuries',
      id: 'numRIDDOR7DdayInjuries',
      fnc: this.numRIDDOR7DayInjuries,
    },
    {
      displayName: 'Total # RIDDOR Cases',
      id: 'numOfRIDDORCases',
      fnc: this.numOfRiddorCases,
    },
    {
      displayName: 'Near Miss Incident Rate',
      id: 'nearMissIncidentRate',
      fnc: this.nearMissIncidentRate,
    },

    // RIDDOR
    {
      displayName: '# RIDDOR Specified Injuries',
      id: 'numOfRIDDORSpecifiedInjuries',
      fnc: this.numOfRIDDORSpecifiedInjuries,
    },
    {
      displayName: '# RIDDOR Major Injuries',
      id: 'numOfRIDDORMajorInjuries',
      fnc: this.numOfRIDDORMajorInjuries,
    },
    {
      displayName: '# RIDDOR Dangerous Occurences',
      id: 'numOfRIDDORDangOccurrences',
      fnc: this.numOfRIDDORDangOccurrences,
    },
    {
      displayName: '# RIDDOR Occuptional Illness Cases',
      id: 'numRIDDOROccupationalIllness',
      fnc: this.numRIDDOROccupationalIllness,
    },
    {
      displayName: 'RIDDOR Major Injuries Rate',
      id: 'RIDDORMajorInjuriesMonthly',
      fnc: this.RIDDORMajorInjuriesMonthly,
    },
    {
      displayName: 'RIDDOR Rate (UK) - Incident Rate',
      id: 'RIDDORRate',
      fnc: this.RIDDORRate,
    },
    {
      displayName: 'RIDDOR Specified Injury (UK) - Incident Rate',
      id: 'RIDDORSpecifiedInjuryMonthly',
      fnc: this.RIDDORSpecifiedInjuryMonthly,
    },
    {
      displayName: 'RIDDOR Dangerous Occurrence Rate (UK) - Incident Rate',
      id: 'RIDDORDangerousOccurrencesMonthly',
      fnc: this.RIDDORDangerousOccurrencesMonthly,
    },
    {
      displayName: 'RIDDOR Occupational illness (UK) - Incident Rate',
      id: 'RIDDOROccupationalIllnessMonthly',
      fnc: this.RIDDOROccupationalIllnessMonthly,
    },
    {
      displayName: 'RIDDOR 7 day Injury Rate (UK) - Incident Rate',
      id: 'RIDDORRiddor7DayInjuryMonthly',
      fnc: this.RIDDORRiddor7DayInjuryMonthly,
    },
    {
      displayName: 'Comparison RIDDOR Rate / Year',
      id: 'RIDDORRateYearly',
      fnc: this.RIDDORRateYearly,
    },
    // deleted
    // { displayName: 'RIDDOR Specified Injury (UK) - Per 12-Month Cycle', id: 'RIDDORSpecifiedInjuryRateYearly', fnc: this.RIDDORSpecifiedInjuryRateYearly },
    // { displayName: 'RIDDOR Dangerous Occurrence Rate (UK) - Per 12-Month Cycle', id: 'RIDDORDangerousOccurrencesYearly', fnc: this.RIDDORDangerousOccurrencesYearly },
    // { displayName: 'RIDDOR Occupational illness (UK)- Per 12-Month Cycle', id: 'RIDDOROccupationalIllnessYearly', fnc: this.RIDDOROccupationalIllnessYearly },
    // { displayName: 'RIDDOR 3 day Injury Rate UK - Per 12-Month Cycle', id: 'RIDDOR3DayInjuryYearly', fnc: this.RIDDOR3DayInjuryYearly },
    // { displayName: 'RIDDOR 7 day Injury Rate UK - Per 12-Month Cycle', id: 'RIDDOR7DayInjuryYearly', fnc: this.RIDDOR7DayInjuryYearly },

    // OSHA
    {
      displayName: 'OSHA DART Rate',
      id: 'OSHADARTRate',
      fnc: this.OSHADARTRate,
    },
    {
      displayName: 'OSHA DART Comparison / Year',
      id: 'OSHAEventsYearly',
      fnc: this.OSHAEventsYearly,
    },
  ];

  contractorReportList = <kpiReport[]>[
    {
      displayName: 'Contractor X - Hours',
      id: 'contractorHours',
      fnc: this.contractorHours,
      isContractorReport: true,
    },
    {
      displayName: 'Contractor X - LTIR Rate',
      id: 'contractorLTIRRate',
      fnc: this.contractorLTIRRate,
      isContractorReport: true,
    },
    {
      displayName: 'Contractor X - TRIR Rate',
      id: 'contractorTRIRRate',
      fnc: this.contractorTRIRRate,
      isContractorReport: true,
    },
    {
      displayName: 'Contractor X - Workforce Per Month',
      id: 'contractorNumberOfWorks',
      fnc: this.contractorNumberOfWorks,
      isContractorReport: true,
    },
    {
      displayName: '# Open Observations by Contractor',
      id: 'contractorNumberOfOpenObservations',
      fnc: this.contractorNumberOfOpenObservations,
      isContractorReport: true,
    },
    {
      displayName: 'Weekly Data Report Status',
      id: 'Weekly Data Report Status',
      fnc: this.contractorTrafficLight,
      isContractorReport: true,
    },
  ];

  async getKpiList(
    res: Response,
    theOrg: Organisation = null,
  ): Promise<TransAtKPIListDTO[]> {
    const org = theOrg ? theOrg : this.localService.getOrganisation(res);

    // First generate our own list of KPIS
    const myList: TransAtKPIListDTO[] = [];
    for (const kpi of this.reportList) {
      myList.push({
        displayName: kpi.displayName,
        id: kpi.id,
        enabled: true,
      });
    }

    // Generate the contractor reports
    const orgContractors = await this.organisationContractorRepo.find({
      organisation: org.id,
    });

    for (const contractor of orgContractors) {
      for (const kpi of this.contractorReportList) {
        myList.push({
          displayName: `${contractor.name}-${kpi.displayName}`,
          originalDisplayName: kpi.displayName,
          id: `${contractor.id}-${kpi.id}`,
          contractorReportId: kpi.id,
          contractorId: contractor.id,
          contractorName: contractor.name,
          enabled: true,
        });
      }
    }

    // Get any missing or any extra in the orgs local list
    // get extra
    if (!org.enabledKPIs) org.enabledKPIs = [];

    for (let i = 0; i < org.enabledKPIs.length; ++i) {
      const kpi = org.enabledKPIs[i];
      // Remove it
      if (!myList.find((x) => x.id === kpi.id)) {
        org.enabledKPIs.splice(i, 1);
        i = 0;
      } else {
        org.enabledKPIs[i].displayName = kpi.displayName;
      }
    }

    // Add any missing
    for (const kpi of myList) {
      // add it
      if (!org.enabledKPIs.find((x) => x.id === kpi.id)) {
        org.enabledKPIs.push(kpi);
      }
    }

    // Update that list
    await this.organisationRepo.save(org);

    // return the list
    return org.enabledKPIs;
  }

  async getKpis(
    res: Response,
    startDate: Date,
    endDate: Date,
  ): Promise<kpiGetReturn> {
    const org = this.localService.getOrganisation(res);
    const kpiList = await this.getKpiList(res);
    const returnData = {};

    const formatedStart = moment(startDate).endOf('day').format()
    const formatedEnd = moment(endDate)
      .add(1, 'day')
      .endOf('day')
      .format();

    for (const kpi of kpiList) {
      if (kpi.contractorReportId) {
        const report = this.contractorReportList.find(
          (x) => x.id === kpi.contractorReportId,
        );
        if (report) {
          try {
            if (!returnData[kpi.originalDisplayName])
              returnData[kpi.originalDisplayName] = {};
            returnData[kpi.originalDisplayName][kpi.contractorName] =
              await report.fnc(
                [org.id],
                [kpi.contractorId],
                formatedStart,
                formatedEnd,
              );
          } catch (err) {
            this.logger.error(err);
          }
        }
      } else {
        const report = this.reportList.find((x) => x.id === kpi.id);
        if (report) {
          try {
            returnData[report.displayName] = await report.fnc(
              [org.id],
              formatedStart,
              formatedEnd,
            );
          } catch (err) {
            this.logger.error(err);
          }
        }
      }
    }
    return returnData;
  }
}
