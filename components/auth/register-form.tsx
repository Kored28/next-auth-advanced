"use client";
import * as z from "zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { RegisterSchema } from "@/schemas";
import { CardWrapper } from "./card-wrapper";
import { FormSuccess } from "../form-success";
import { register } from "@/actions/register";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"


export const RegisterForm  = () => {
    const [view, setView] = useState("password");
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        }
    });

    const toggleView = () => {
        setView(view === "password" ? "text" : "password");
    };

    const IconElement = view === "password" ? FaEye : FaEyeSlash;

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success)
                })
        })
    }


    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="John Doe"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending}
                                            placeholder="johndoe@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                placeholder="*****"
                                                type={view}
                                            />
                                        </FormControl>
                                        <div className="flex absolute right-2 top-3">
                                            <IconElement
                                                onClick={toggleView}
                                                className="h-4 w-4 cursor-pointer"
                                            />
                                            
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success}/>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}