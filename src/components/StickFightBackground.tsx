"use client";

import { useEffect, useRef } from "react";

export default function StickFightBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        // Resize canvas
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        // Game Constants
        const GRAVITY = 0.5;
        const SPEED = 3;
        const JUMP_FORCE = -12;
        const FLOOR_Y = canvas.height - 50;

        // Platforms
        const platforms = [
            { x: 0, y: canvas.height - 20, w: canvas.width, h: 20 }, // Ground
            { x: canvas.width * 0.2, y: canvas.height * 0.7, w: 200, h: 20 },
            { x: canvas.width * 0.6, y: canvas.height * 0.6, w: 200, h: 20 },
            { x: canvas.width * 0.4, y: canvas.height * 0.4, w: 200, h: 20 },
            { x: canvas.width * 0.1, y: canvas.height * 0.3, w: 150, h: 20 },
            { x: canvas.width * 0.7, y: canvas.height * 0.25, w: 150, h: 20 },
        ];

        class Stickman {
            x: number;
            y: number;
            vx: number;
            vy: number;
            color: string;
            width: number = 20;
            height: number = 60;
            grounded: boolean = false;
            facingRight: boolean = true;
            attackCooldown: number = 0;
            isAttacking: boolean = false;
            hp: number = 100;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.color = color;
            }

            update(target: Stickman) {
                // AI Logic
                const dx = target.x - this.x;
                const dist = Math.abs(dx);

                // Movement
                if (dist > 40) {
                    this.vx = dx > 0 ? SPEED : -SPEED;
                    this.facingRight = dx > 0;
                } else {
                    this.vx = 0;
                    // Attack
                    if (this.attackCooldown <= 0) {
                        this.isAttacking = true;
                        this.attackCooldown = 60;
                        // Hit detection
                        if (Math.abs(target.y - this.y) < 50 && Math.abs(target.x - this.x) < 60) {
                            target.vy = -5;
                            target.vx = this.facingRight ? 10 : -10;
                        }
                    }
                }

                // Jump randomly or if stuck
                if (this.grounded && (Math.random() < 0.01 || (dist > 100 && Math.random() < 0.02))) {
                    this.vy = JUMP_FORCE;
                    this.grounded = false;
                }

                // Physics
                this.vy += GRAVITY;
                this.x += this.vx;
                this.y += this.vy;

                // Cooldowns
                if (this.attackCooldown > 0) this.attackCooldown--;
                if (this.attackCooldown < 40) this.isAttacking = false;

                // Platform Collision
                this.grounded = false;
                platforms.forEach(p => {
                    if (
                        this.x + this.width > p.x &&
                        this.x < p.x + p.w &&
                        this.y + this.height > p.y &&
                        this.y + this.height < p.y + p.h + 10 &&
                        this.vy >= 0
                    ) {
                        this.y = p.y - this.height;
                        this.vy = 0;
                        this.grounded = true;
                    }
                });

                // Screen boundaries
                // Screen boundaries
                if (this.x < 0) this.x = 0;
                if (this.x > window.innerWidth) this.x = window.innerWidth;
                if (this.y > window.innerHeight) { // Respawn
                    this.y = 0;
                    this.vy = 0;
                    this.x = Math.random() * window.innerWidth;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";

                const centerX = this.x + this.width / 2;
                const headY = this.y + 10;
                const bodyTopY = this.y + 20;
                const bodyBottomY = this.y + 45;

                // Head
                ctx.beginPath();
                ctx.arc(centerX, headY, 10, 0, Math.PI * 2);
                ctx.stroke();

                // Body
                ctx.beginPath();
                ctx.moveTo(centerX, bodyTopY);
                ctx.lineTo(centerX, bodyBottomY);
                ctx.stroke();

                // Arms
                ctx.beginPath();
                ctx.moveTo(centerX, bodyTopY + 5);
                if (this.isAttacking) {
                    // Attack pose
                    const handX = this.facingRight ? centerX + 30 : centerX - 30;
                    ctx.lineTo(handX, bodyTopY);
                } else {
                    // Idle/Run pose
                    const sway = Math.sin(Date.now() / 200) * 10;
                    ctx.lineTo(centerX - 15, bodyTopY + 15 + sway);
                    ctx.moveTo(centerX, bodyTopY + 5);
                    ctx.lineTo(centerX + 15, bodyTopY + 15 - sway);
                }
                ctx.stroke();

                // Legs
                ctx.beginPath();
                ctx.moveTo(centerX, bodyBottomY);
                if (this.grounded) {
                    if (Math.abs(this.vx) > 0.1) {
                        // Running
                        const step = Math.sin(Date.now() / 100) * 15;
                        ctx.lineTo(centerX - 10 + step, this.y + this.height);
                        ctx.moveTo(centerX, bodyBottomY);
                        ctx.lineTo(centerX + 10 - step, this.y + this.height);
                    } else {
                        // Idle
                        ctx.lineTo(centerX - 10, this.y + this.height);
                        ctx.moveTo(centerX, bodyBottomY);
                        ctx.lineTo(centerX + 10, this.y + this.height);
                    }
                } else {
                    // Jumping
                    ctx.lineTo(centerX - 15, this.y + this.height - 10);
                    ctx.moveTo(centerX, bodyBottomY);
                    ctx.lineTo(centerX + 15, this.y + this.height - 5);
                }
                ctx.stroke();
            }
        }

        const p1 = new Stickman(100, 100, "white");
        const p2 = new Stickman(window.innerWidth - 100, 100, "white");

        const loop = () => {
            if (!canvas) return;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Platforms
            ctx.fillStyle = "#333";
            platforms.forEach(p => {
                ctx.fillRect(p.x, p.y, p.w, p.h);
            });

            // Update & Draw Players
            p1.update(p2);
            p2.update(p1);

            p1.draw(ctx);
            p2.draw(ctx);

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />;
}
