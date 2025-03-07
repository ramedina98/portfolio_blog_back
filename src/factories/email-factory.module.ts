import { Module } from "@nestjs/common";
import { EmailFactory } from "./EmailFactory";
import { EmailModule } from "src/utils/email/email.module";

@Module({
    imports: [EmailModule],
    providers: [EmailFactory],
    exports: [EmailFactory]
})
export class EmailFactoryModule {}