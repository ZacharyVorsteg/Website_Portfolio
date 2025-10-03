import Container from '@/components/Container';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import homeData from '@/content/home.json';

export default function Home() {
  const { hero, whatIBuild, workPreview, statement, stack, testimonials } = homeData;

  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              {hero.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {hero.subtitle}
            </p>
            
            {/* Cred Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {hero.credBar.map((item, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button href={hero.primaryCta.href} variant="primary">
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* What I Build */}
      <Section title={whatIBuild.title} className="bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whatIBuild.items.map((item, i) => (
              <Card key={i}>
                <h3 className="text-xl font-bold text-[#0B2D5B] mb-4">
                  {item.title}
                </h3>
                <ul className="space-y-3" role="list">
                  {item.bullets.map((bullet, j) => (
                    <li key={j} className="text-gray-600 leading-relaxed flex items-start">
                      <span className="text-[#0B2D5B] mr-2 mt-1 font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Work Preview */}
      <Section title={workPreview.title}>
        <Container>
          <div className="space-y-6">
            {workPreview.items.map((item) => (
              <Card key={item.slug} className="hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.oneLiner}
                  </p>
                  <p className="text-sm text-[#0B2D5B] font-medium">
                    {item.impact}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button href={workPreview.cta.href} variant="primary">
              {workPreview.cta.label}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Professional Statement */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {statement.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {statement.text}
            </p>
          </div>
        </Container>
      </Section>

      {/* Tech Stack */}
      <Section title={stack.title}>
        <Container>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {stack.areas.map((area, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0B2D5B]">
                  {area.label}
                </h3>
                <ul className="space-y-2" role="list">
                  {area.items.map((item, j) => (
                    <li key={j} className="text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((quote, i) => (
              <blockquote key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-700 italic leading-relaxed">
                  {quote}
                </p>
              </blockquote>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section>
        <Container>
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to solve your next challenge?
            </h2>
            <Button href="/contact" variant="primary">
              Let's talk
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

