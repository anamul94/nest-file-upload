import { Repository } from "typeorm";
import { PdfFile } from "./entity/pdf.entity";

export default class PdfFileRepository extends Repository<PdfFile> {}