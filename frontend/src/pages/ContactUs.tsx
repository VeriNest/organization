// components/ContactUs.tsx
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "../components/Navbar";

interface ContactUsProps {
	sidebarOpen: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContactUs = ({ sidebarOpen, setSidebarOpen }: ContactUsProps) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Simulate form submission
		setTimeout(() => {
			setLoading(false);
			toast.success(
				"Message sent successfully! We will get back to you within 24 hours."
			);
			setFormData({ name: "", email: "", subject: "", message: "" });
		}, 1000);
	};

	const contactInfo = [
		{
			icon: Mail,
			title: "Email Us",
			details: "support@verinest.com",
			description: "Send us an email anytime",
		},
		{
			icon: Phone,
			title: "Call Us",
			details: "+234 800 000 0000",
			description: "Mon to Fri, 9am to 6pm",
		},
		{
			icon: MapPin,
			title: "Visit Us",
			details: "Lagos, Nigeria",
			description: "Come say hello at our office",
		},
		{
			icon: Clock,
			title: "Response Time",
			details: "Within 24 hours",
			description: "We typically reply quickly",
		},
	];

	return (
		<>
			<Navbar
				onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
				sidebarOpen={sidebarOpen}
			/>

			<div className="min-h-screen bg-background py-8">
				<div className="container mx-auto px-4 max-w-6xl">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold mb-4">Contact Us</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Have questions? We're here to help. Get in touch
							with our team.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Contact Information */}
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Get in Touch</CardTitle>
									<CardDescription>
										We'd love to hear from you. Choose the
										most convenient way to reach us.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{contactInfo.map((item, index) => (
										<div
											key={index}
											className="flex items-start space-x-4"
										>
											<div className="bg-primary/10 p-2 rounded-lg">
												<item.icon className="h-5 w-5 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold">
													{item.title}
												</h3>
												<p className="text-primary font-medium">
													{item.details}
												</p>
												<p className="text-sm text-muted-foreground">
													{item.description}
												</p>
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* FAQ Quick Links */}
							<Card>
								<CardHeader>
									<CardTitle>Quick Help</CardTitle>
									<CardDescription>
										Common questions and resources
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2">
									<Button
										variant="outline"
										className="w-full justify-start"
										asChild
									>
										<a href="/help">
											Help Center & Documentation
										</a>
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start"
										asChild
									>
										<a href="/safety">Safety Guidelines</a>
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start"
										asChild
									>
										<a href="/disputes">
											Dispute Resolution
										</a>
									</Button>
								</CardContent>
							</Card>
						</div>

						{/* Contact Form */}
						<div className="lg:col-span-2">
							<Card>
								<CardHeader>
									<CardTitle>Send us a Message</CardTitle>
									<CardDescription>
										Fill out the form below and we'll get
										back to you as soon as possible.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<form
										onSubmit={handleSubmit}
										className="space-y-6"
									>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="name">
													Full Name *
												</Label>
												<Input
													id="name"
													value={formData.name}
													onChange={(e) =>
														setFormData({
															...formData,
															name: e.target
																.value,
														})
													}
													placeholder="Enter your full name"
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email">
													Email Address *
												</Label>
												<Input
													id="email"
													type="email"
													value={formData.email}
													onChange={(e) =>
														setFormData({
															...formData,
															email: e.target
																.value,
														})
													}
													placeholder="Enter your email"
													required
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="subject">
												Subject *
											</Label>
											<Input
												id="subject"
												value={formData.subject}
												onChange={(e) =>
													setFormData({
														...formData,
														subject: e.target.value,
													})
												}
												placeholder="What is this regarding?"
												required
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="message">
												Message *
											</Label>
											<Textarea
												id="message"
												rows={6}
												value={formData.message}
												onChange={(e) =>
													setFormData({
														...formData,
														message: e.target.value,
													})
												}
												placeholder="Please describe your inquiry in detail..."
												required
											/>
										</div>

										<Button
											type="submit"
											className="w-full"
											disabled={loading}
										>
											{loading ? (
												<>Sending Message...</>
											) : (
												<>
													<Send className="h-4 w-4 mr-2" />
													Send Message
												</>
											)}
										</Button>
									</form>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
