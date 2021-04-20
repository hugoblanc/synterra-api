export interface TransporterConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: TransporterAuth;
}


export interface TransporterAuth {
  user: string;
  pass: string;

}
