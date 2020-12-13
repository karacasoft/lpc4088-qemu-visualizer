import { LinkModel } from "@projectstorm/react-diagrams";
import { readFileSync } from "fs";
import CircuitSimulator, { chip, zeroOrMore, or, resistance, ldr, led, ground, voltage, CircuitNodeRule, Ruleset } from '../CircuitSimulator';
import PeripheralNodeModel from "../Nodes/PeripheralNodeModel";

export enum Rule {
    LED = "led",
    SWITCH = "switch",
    JOYSTICK = "joystick",
    ULTRASONIC = "ultrasonic",

}

type CircuitCheckerRulesetType = (Ruleset & { name: string });

export default class CircuitCheckerRuleset {
    
    rulesets: CircuitCheckerRulesetType[] = [];
    results: any = {};

    checkPin(start_link: LinkModel, start_node: PeripheralNodeModel) {
        this.rulesets.forEach((ruleset) => {
            const res = CircuitSimulator.checkRuleset(ruleset, ruleset.name, start_link, start_node);
            if(!this.results[ruleset.name]) {
                this.results[ruleset.name] = Boolean(res);
            }
        });
    }

    static generateLEDRule(port: number, pin: number, ending_node: "voltage" | "ground", name: string) {
        let rule: CircuitCheckerRulesetType;
        if(ending_node === "ground") {
            rule = {
                rules: [
                    chip({ port_nr: port, pin_nr: pin }),
                    zeroOrMore(or([resistance(), ldr()])),
                    zeroOrMore(led("+-")),
                    zeroOrMore(or([resistance(), ldr()])),
                    ground(),
                ],
                name,
            };
        } else {
            rule = {
                rules: [
                    chip({ port_nr: port, pin_nr: pin }),
                    zeroOrMore(or([resistance(), ldr()])),
                    zeroOrMore(led("-+")),
                    zeroOrMore(or([resistance(), ldr()])),
                    voltage(),
                ],
                name,
            }
        }
        return rule;
    }

    // Format: led <port> <pin> [voltage|ground] <rule_name>
    static parseLEDRule(led_rule: string) {
        const args = led_rule.trim().split(" ");
        if(args[3] !== "voltage" && args[3] !== "ground") {
            throw new Error(`Syntax error while parsing rule "${led_rule}"`);
        }
        return CircuitCheckerRuleset.generateLEDRule(
            parseInt(args[1]),
            parseInt(args[2]),
            args[3],
            args[4]
        );
    }

    static fromFile(file: string) {
        const checker = new CircuitCheckerRuleset();

        const rule_file_contents = readFileSync(file);
        const rules = rule_file_contents.toString("utf8").split("\n");

        rules.forEach(rule => {
            if(rule.startsWith(Rule.LED)) {
                checker.rulesets.push(CircuitCheckerRuleset.parseLEDRule(rule));
            }
        });
        return checker;
    }
}