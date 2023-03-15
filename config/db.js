var postgres_db_config = {
    host: "abul.db.elephantsql.com",
    //port: 52145,
    user: "tacfzhol",
    password: 'FGh-4hz9eaJOm_fTMxMb-iVRp4eOCnT_',
    database: "tacfzhol",
};

var postgres_timescale_config = {
    host: "pza8onbjvs.gj1orfdtis.tsdb.cloud.timescale.com",
    port: 37603,
    user: "tsdbadmin",
    password: 'bfwhzwkrk8h6aqsz',
    database: "tsdb",
};

var mysql_db_config = {
    host: "188.40.175.213",
    port: 52145,
    user: "poy8b_cedbal1l",
    password: 'woXXRRD,5^";xnTVp^*-',
    database: "store",
    page_size: 1000
};

var mysql_planetscale_config = {
    host: "eu-west.connect.psdb.cloud", // postgresql-73144-0.cloudclusters.net
    port: 3306,
    user: "4ccve5imyu2vyk3oc4wr",
    password: 'pscale_pw_PqThJTUNDMoEuVIGIyoiVImvpFYDYYag1XyruSYMifI',
    database: "syncer",
    page_size: 1000
};

module.exports.postgres_db_config = postgres_db_config;
module.exports.mysql_db_config = mysql_db_config;
module.exports.mysql_planetscale_config = mysql_planetscale_config;
module.exports.postgres_timescale_config = postgres_timescale_config;