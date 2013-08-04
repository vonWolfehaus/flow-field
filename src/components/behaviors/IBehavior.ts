/// <reference path="../../lib/Vec2.ts" />
/// <reference path="../Velocity2.ts" />

interface IBehavior {
	update:(vel:von.Velocity2) => Vec2;
	configure:(settings:any) => void;
}