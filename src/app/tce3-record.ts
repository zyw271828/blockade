// https://github.com/darpa-i2o/Transparent-Computing/blob/master/README-E3.md
export interface Tce3Record {
  uuid: string; // "83C8ED1F-5045-DBCD-B39F-918F0DF4F851"
  datum: string; // "{"com.bbn.tc.schema.avro.cdm18.Host":{"uuid":"83C8ED1F-5045-DBCD-B39F-918F0DF4F851","hostName":"ta1-cadets","hostIdentifiers":[],"osDetails":"FreeBSD 12.0-CURRENT FreeBSD 12.0-CURRENT #1 1863588dca9(HEAD)-dirty: Wed Feb 28 17:23:37 UTC 2018     root@ta1-cadets:/usr/obj/data/update/build-meta/freebsd/amd64.amd64/sys/CADETS  amd64","hostType":"HOST_DESKTOP","interfaces":[{"name":"vtnet0","macAddress":"52:54:00:f0:0d:23","ipAddresses":["fe80::5054:ff:fef0:d23%vtnet0","10.0.6.23"]},{"name":"vtnet1","macAddress":"52:54:00:f0:08:23","ipAddresses":["fe80::5054:ff:fef0:823%vtnet1","128.55.12.73"]}]}}"
  cdmVersion: string; // "18"
  source: string; // "SOURCE_FREEBSD_DTRACE_CADETS"
}
