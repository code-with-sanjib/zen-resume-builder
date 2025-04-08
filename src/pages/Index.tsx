
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Download, BarChart } from "lucide-react";
import { defaultTemplates } from "@/data/templates";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Create a professional</span>
                <span className="block text-primary">ATS-friendly resume</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Build your perfect resume in minutes with our easy-to-use builder and professionally designed templates.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link to="/templates">
                  <Button size="lg" className="mr-4">
                    Choose a Template
                  </Button>
                </Link>
                <Link to="/editor">
                  <Button variant="outline" size="lg">
                    Start from Scratch
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white sm:rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                    alt="Resume builder preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Features to help you build the perfect resume
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our tools make it easy to create professional, ATS-friendly resumes.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      ATS-Friendly Templates
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      All templates are designed to pass through Applicant Tracking Systems with ease.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Easy Content Editing
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Simple interface to add your information, experience, and skills with real-time preview.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <Download className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Multiple Export Options
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Download your resume as PDF, Word document, or image to use anywhere.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <BarChart className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Resume Analytics
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get insights on how to improve your resume and track its performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose from our professional templates
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              10+ ATS-friendly templates for any job application
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {defaultTemplates.slice(0, 3).map((template) => (
              <div key={template.id} className="group">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className="h-48 w-full bg-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: template.color + '10' }}
                  >
                    <span className="text-center text-xl font-medium text-gray-500">
                      {template.name} Template
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{template.description}</p>
                    <div className="mt-4">
                      <Link to={`/templates?selected=${template.id}`}>
                        <Button variant="outline" size="sm">View Template</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/templates">
              <Button>View All Templates</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to build your perfect resume?
            </h2>
            <p className="mt-4 text-xl text-primary-foreground">
              Start for free, no credit card required.
            </p>
          </div>
          <div className="mt-10 max-w-md mx-auto lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-xl font-medium text-gray-900">Free</h3>
                <p className="mt-4 text-gray-500">
                  Everything you need to create a basic resume
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Access to 3 templates</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">PDF downloads</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Basic editor features</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/templates">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-8 border-2 border-accent">
                <h3 className="text-xl font-medium text-gray-900">Premium</h3>
                <p className="mt-4 text-gray-500">
                  Advanced features for serious job seekers
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">$12</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Access to all 10+ templates</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">PDF, Word, and Image downloads</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Advanced editing features</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Resume analytics</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">Priority support</p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/templates">
                    <Button className="w-full bg-accent hover:bg-accent/90">Upgrade Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
