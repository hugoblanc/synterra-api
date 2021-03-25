/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const spinalCore = require('spinal-core-connectorjs');
const models = require('./spinal/product');

@Injectable()
export class AppService {}
